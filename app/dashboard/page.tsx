"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
};

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // 🔹 Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBookmarks(data);
  };

  // Realtime subscription
  useEffect(() => {
  fetchBookmarks();

  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "bookmarks" },
      (payload) => {
        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "bookmarks" },
      (payload) => {
        setBookmarks((prev) =>
          prev.filter((bm) => bm.id !== payload.old.id)
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  //  Add bookmark 
const addBookmark = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      title,
      url,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) return;

  // 🔥 instantly update current tab UI
  setBookmarks((prev) => [data as Bookmark, ...prev]);

  setTitle("");
  setUrl("");
};


  // 🔹 Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="Title"
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="URL"
          className="border p-2 flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="bg-black text-white px-4"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {bookmarks.map((bm) => (
          <li key={bm.id} className="border p-3 flex justify-between">
            <div>
              <p className="font-semibold">{bm.title}</p>
              <a href={bm.url} className="text-blue-500" target="_blank">
                {bm.url}
              </a>
            </div>
            <button
              onClick={() => deleteBookmark(bm.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

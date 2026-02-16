"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };

    getUser();
  }, []);

  return (
    <div className="p-10 text-xl">
      {userEmail ? `Logged in as ${userEmail}` : "Not logged in"}
    </div>
  );
}

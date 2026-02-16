"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Login with Google
      </button>
    </div>
  );
}

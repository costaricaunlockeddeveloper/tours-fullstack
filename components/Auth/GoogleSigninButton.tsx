"use client";

import { GoogleIcon } from "@/assets/icons";
import { signIn } from "next-auth/react";

export default function GoogleSigninButton({ text }: { text: string }) {

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/sign-in" });
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="flex w-full items-center justify-center gap-3.5 rounded-xl border border-white/20 bg-white/5 p-[15px] font-medium text-white transition hover:bg-white/10 hover:shadow-lg"
    >
      <GoogleIcon />
      {text} with Google
    </button>
  );
}

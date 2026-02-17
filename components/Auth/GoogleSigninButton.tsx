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
      className="flex w-full items-center justify-center gap-3.5 rounded-xl border border-stroke bg-gray-2 p-[15px] font-medium text-black transition hover:bg-opacity-90 hover:shadow-lg dark:border-strokedark dark:bg-white/10 dark:text-white"
    >
      <GoogleIcon />
      {text} with Google
    </button>
  );
}

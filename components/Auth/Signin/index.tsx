import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-white/10"></span>
        <div className="block w-full min-w-fit bg-transparent px-3 text-center font-medium text-dark-5 dark:text-white/50">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-white/10"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p className="text-dark-5 dark:text-white/60">
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:text-dark dark:hover:text-white transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}

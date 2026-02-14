import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <GoogleSigninButton text="Continuar" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-white/10"></span>
        <div className="block w-full min-w-fit bg-transparent px-3 text-center font-medium text-dark-5 dark:text-white/50">
          O ingresa con tu correo
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-white/10"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>
    </>
  );
}

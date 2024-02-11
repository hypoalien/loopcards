import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useNavigate, useLocation } from "react-router-dom";
import logoWithText from "../images/loopcardsLogoTextTransperent.png";
import logo from "../images/loopcardsLogoTransperent.png";

export default function Example() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cardId } = location.state ? location.state : "";
  console.log("loginorSignup", cardId);

  const handleSignUp = (event) => {
    event.preventDefault();
    console.log("clicked on signup");
    navigate("/signup", { state: { cardId: cardId } });
  };
  const handlelogin = (event) => {
    console.log("clicked on login");
    event.preventDefault();

    navigate("/login", { state: { cardId: cardId } });
  };
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-200">
              Choose an option
            </h2>
          </div>
          <form className="mt-8 space-y-6">
            <div>
              <button
                type="submit"
                onClick={handlelogin}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-zinc-800/50  py-2 px-4 text-sm font-medium text-teal-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                    aria-hidden="true"
                  />
                </span>
                Login
              </button>
            </div>
            <h4 className="mt-6 text-center text-2x1 font-bold tracking-tight text-zinc-200">
              Or
            </h4>
            <div>
              <button
                onClick={handleSignUp}
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-zinc-800/50  py-2 px-4 text-sm font-medium text-teal-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                    aria-hidden="true"
                  />
                </span>
                Sign Up
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-200">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-teal-600 hover:text-teal-500">
                  Forgot your password?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

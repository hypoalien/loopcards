import { LockClosedIcon } from "@heroicons/react/20/solid";
import axios from "../utility/axios";
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import logoWithText from "../images/loopcardsLogoTextTransperent.png";
import logo from "../images/loopcardsLogoTransperent.png";

export default function Example() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();

  const cardID = useSelector((state) => state.cardID);

  const { cardId } = location.state ? location.state : "";
  console.log("signup", cardId);
  console.log("Statesignup", cardID);

  const handleSubmit = async (e) => {
    let reqBody = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    if (cardId) {
      reqBody = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        cardID: cardId,
      };
    }
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/users/signup", reqBody);
      console.log(response.data);
      signIn({
        token: response.data.accessToken,
        expiresIn: 36000,
        tokenType: "Bearer",
        authState: { email: email },
      });
      setIsLoading(false);

      navigate("/edit");
    } catch (error) {
      console.error(error);
      setError("Failed to sign up. Please try again later.");
      setIsLoading(false);
    }
  };
  if (isAuthenticated()) {
    return <Navigate to="/home" />;
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-200">
              Create your account
            </h2>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            action="#"
            method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-gray-200 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-gray-200 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="confirm-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-gray-200 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
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
            {error && (
              <p className="ml-2 block text-sm text-zinc-200">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-zinc-800/50  py-2 px-4 text-sm font-medium text-teal-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                    aria-hidden="true"
                  />
                </span>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

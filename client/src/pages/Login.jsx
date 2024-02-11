import { LockClosedIcon } from "@heroicons/react/20/solid";
import axios from "../utility/axios";
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import { login, logout, updateCardID } from "../actions";
import logoWithText from "../images/loopcardsLogoTextTransperent.png";
import logo from "../images/loopcardsLogoTransperent.png";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false); // Add a loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const token = useSelector((state) => state.token);
  const cardID = useSelector((state) => state.cardID);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const { cardId } = location.state ? location.state : "";
  console.log("login", cardId);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post("/users/login", {
        email,
        password,
        cardID: cardId,
      });
      console.log(response.data);
      if (response.data.accessToken) {
        dispatch(login(response.data.accessToken));
        signIn({
          token: response.data.accessToken,
          expiresIn: 36000,
          tokenType: "Bearer",
          authState: { email: email },
        });
        console.log("Store log ", isLoggedIn);
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
      console.error(error);
      setError("Failed to log in. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  if (isAuthenticated()) {
    return <Navigate to="/home" />;
  } else {
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
                Sign in to your account
              </h2>
            </div>
            <form
              className="mt-8 space-y-6"
              action="#"
              method="POST"
              onSubmit={handleSubmit}>
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
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-zinc-700 px-3 py-2 bg-zinc-900 text-zinc-200 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
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
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-zinc-700 px-3 py-2 bg-zinc-900 text-zinc-200 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
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
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-zinc-800/50  hover:bg-zinc-800  py-2 px-4 text-sm font-medium text-teal-500  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-tal-500 group-hover:text-teal-400"
                      aria-hidden="true"
                    />
                  </span>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

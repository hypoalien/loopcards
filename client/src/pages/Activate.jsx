// import Image from 'next/future/image'
import { Helmet } from "react-helmet";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import card from "../images/activate.png";
import logoWithText from "../images/loopcardsLogoTextTransperent.png";
import logo from "../images/loopcardsLogoTransperent.png";
export default function Activate({ cardId }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/loginOrSignUp", { state: { cardId: cardId } });
  };
  console.log("acvtivate", cardId);
  return (
    <>
      <Helmet>
        <title>Activate your card</title>
        <meta name="description" content="Activate your card now!" />
      </Helmet>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-200">
              Thanks For choosing Loop cards
            </h2>
          </div>
          <div className=" px-0 lg:max-w-none ">
            <img
              src={card}
              alt=""
              sizes="(min-width: 300px) 16rem, 10rem"
              className="aspect-[3/4] max-h-80 max-w-xs mx-auto justify-self-center  rounded-2xl   bg-zinc-800"
            />
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-zinc-800/50  py-2 px-4 text-sm font-medium text-teal-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                    aria-hidden="true"
                  />
                </span>
                Activate your card
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  required="true"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-200">
                  Terms and Conditions
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-teal-600 hover:text-teal-500">
                  Want more?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

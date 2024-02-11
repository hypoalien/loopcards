import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoginOrSignUp from "./pages/LoginOrSignUp";
import UserDetails from "./pages/UserDetails";
import { RequireAuth } from "react-auth-kit";
import AutoLogout from "./components/AutoLogout";

function App() {
  return (
    <>
      <AutoLogout />
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className=" " />
        </div>
      </div>
      <main>
        <div className="relative  bg-zinc-900 ring-zinc-300/20 ">
          <Header />
          <Routes>
            <Route
              exact
              path="/home"
              element={
                <RequireAuth loginPath={"/login"}>
                  <Homepage />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/edit"
              element={
                <RequireAuth loginPath={"/login"}>
                  {<EditProfile />}
                </RequireAuth>
              }
            />
            <Route path="/user/:cardId" element={<UserDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/loginOrSignUp" element={<LoginOrSignUp />} />
            <Route path="*" element={<Login />} />
          </Routes>
          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;

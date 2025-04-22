import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import previewImg from "../assets/preview3.png";

const AuthForm = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="h-screen w-full flex items-center justify-between bg-gray-100 overflow-hidden">
      {/* Left side: App Preview / Banner */}
      <div className="w-3/5 hidden h-full md:flex flex-col items-center justify-center text-gray-900 p-10">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            🎬 YouTube Video Summarizer
          </h1>
          <p className="text-lg mb-6">
            Paste any YouTube link and get a clean, accurate summary in seconds.
          </p>
          <img
            src={previewImg}// <-- Replace with your actual screenshot
            alt="App preview"
            className="w-full h-[500px] rounded-lg shadow-2xl border border-white/20"
          />
        </div>
      </div>

      {/* Right side: Login/Register Card */}
      <div className="w-full md:w-2/5 h-full flex items-center justify-center bg-gray-900 shadow-lg">
        <div className="mx-auto mt-10 p-6 w-[320px] bg-white shadow-xl rounded-lg transition-all duration-300">
          <h2 className="text-2xl font-bold text-center mb-4">
            {mode === "login" ? "Login" : "Register"}
          </h2>

          {/* animated container */}
          <div className="relative min-h-[180px] overflow-hidden">
            <div className="absolute inset-0 transition-all duration-300">
              {/* Login Form */}
              <div
                className={`absolute w-full transition-all duration-300 ${
                  mode === "login"
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 -translate-x-6 z-0 pointer-events-none"
                }`}
              >
                <Login />
              </div>

              {/* Register Form */}
              <div
                className={`absolute w-full transition-all duration-300 ${
                  mode === "register"
                    ? "opacity-100 translate-x-0 z-10"
                    : "opacity-0 translate-x-6 z-0 pointer-events-none"
                }`}
              >
                <Register />
              </div>
            </div>
          </div>

          <p className="text-sm text-center mt-4">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                setMode(mode === "login" ? "register" : "login")
              }
              className="text-blue-600 underline hover:text-blue-800 transition-all"
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CircleLoader from "./CircleLoader";

const LoginForm = () => {
  const {setUserName, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);

      const res = await axios.post("/token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setUserName(res.data.username);
      setIsLoggedIn(true);
      setMessage("✅ Logged in!");
      navigate("/summary");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "❌ Login failed.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full transition-all duration-300">
      <input
        type="email"
        placeholder="Username"
        className="w-full p-2 bg-white text-black border border-gray-500 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition-all"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 bg-white text-black border border-gray-500 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-400 transition-all"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {message && <p className="text-sm text-center text-red-500">{message}</p>}
      <button disabled={loading} className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all">
        {loading ? 
            <CircleLoader /> 
          : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;

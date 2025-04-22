import { useState } from "react";
import CircleLoader from "./CircleLoader";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../Api";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUserName, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/register", null, {
        params: { username, password },
      });
      setUserName(res.data.username);
      setIsLoggedIn(true);
      navigate("/summary");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "❌ Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 transition-all duration-300">
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
      {message && <p className="text-sm text-center text-green-600">{message}</p>}
      <button disabled={loading} className="w-full flex items-center justify-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-all">
        {loading ? 
            <CircleLoader /> 
          : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;

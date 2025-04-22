import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full p-4 bg-white shadow flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">YT Summary</h1>
      {username && (
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium">Hello, {username}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

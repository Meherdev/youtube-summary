import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthForm from "./pages/Auth";
import { AuthProvider } from "./context/authContext";
import useAuth from "./hooks/useAuth";
import Summary from "./pages/summary";
import { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/summary" replace /> : children;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <AuthForm />
            </PublicRoute>
            } />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

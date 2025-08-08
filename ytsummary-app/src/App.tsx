import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Summary from "./pages/summary";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Summary />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

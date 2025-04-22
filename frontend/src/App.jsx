import { Routes, Route } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./zustand/Auth";
import { useEffect } from "react";

function App() {
  const { refreshToken } = useAuth();

  useEffect(() => {
    refreshToken();
  }, []);
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;

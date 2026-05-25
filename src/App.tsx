import { Routes, Route, NavLink } from "react-router";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import User from "./pages/User"
function App() {
  return (
    <>
      <nav className="bg-slate-800 text-white p-4 flex gap-4">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-indigo-400 font-bold" : "text-white"}>
          Login
        </NavLink>

        {/* <NavLink to="/admin" className={({ isActive }) => isActive ? "text-indigo-400 font-bold" : "text-white"}>
          Admin
        </NavLink> */}
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </>
  );
}

export default App;
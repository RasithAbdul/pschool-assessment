import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function SidebarLayout() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p>Please login</p>;

  return (
    <div className="flex min-h-screen">
      <div className="bg-gray-800 text-white w-64 p-4 fixed h-full top-0 left-0">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/parents" className="hover:bg-gray-700 px-3 py-2 rounded">Parents</Link>
          <Link to="/students" className="hover:bg-gray-700 px-3 py-2 rounded">Students</Link>
        </nav>
        <div className="mt-6">
          <span>Welcome, {user.name}</span>
          <button className="ml-2 px-2 py-1 bg-red-500 rounded" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="flex-1 ml-64 p-6">
        <Outlet />
      </div>
    </div>
  );
}

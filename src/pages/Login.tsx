import { useNavigate } from "react-router";
import { use, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e: any) {
    e.preventDefault();

    const response = await fetch("http://localhost:3005/memberships/exists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.exists) {
      //setMessage("Login successful");
      const userId = data.id;
      const userRole = data.role;
      console.log("User ID is log ino:", userId);
      if(userRole !== "Admin") {
        navigate(`/user/${userId}`);
        return;
      }
      else{
      navigate(`/admin/${userId}`);}
    } else {
      setMessage("Wrong email or password");
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-800 p-8 rounded-xl space-y-5"
      >
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <div>
          <label className="block mb-2">Email</label>
          <input
            className="w-full px-4 py-2 rounded text-black"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block mb-2">Password</label>
          <input
            className="w-full px-4 py-2 rounded text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
        >
          Login
        </button>

        {message && (
          <p className="text-center text-sm text-slate-300">{message}</p>
        )}
      </form>
    </main>
  );
}

export default Login;
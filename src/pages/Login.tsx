import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState<"login" | "code">("login");
  const [code, setCode] = useState("");
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const [pendingUserRole, setPendingUserRole] = useState("");

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

    if (data.exists && data.requiresCode) {
      setPendingUserId(data.id);
      setPendingUserId(data.id);
      setPendingUserRole(data.role);
      setStep("code");
      setMessage("Check backend console for your code");
    } else {
      setMessage("Wrong email or password");
    }
  }

  async function handleVerifyCode(e: any) {
    e.preventDefault();

    const response = await fetch("http://localhost:3005/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: pendingUserId,
        code,
      }),
    });

    const data = await response.json();
    if (data.success) {
  if (pendingUserRole !== "Admin") {
    localStorage.setItem("userId", String(data.id));
    navigate("/user");
  } else {
    localStorage.setItem("adminId", String(data.id));
    navigate("/admin");
  }
} else {
  setMessage("Wrong authentication code");
}
    
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')",
  }}
    
    
    >
      {step === "login" && (
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-slate-800 p-8 rounded-xl space-y-5"
        >
          <h1 className="text-3xl font-bold text-center">Login</h1>

          <input
            className="w-full px-4 py-2 rounded text-white"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="w-full px-4 py-2 rounded text-white"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold">
            Continue
          </button>

          {message && <p className="text-center">{message}</p>}
        </form>
      )}

      {step === "code" && (
        <form
          onSubmit={handleVerifyCode}
          className="w-full max-w-md bg-slate-800 p-8 rounded-xl space-y-5"
        >
          <h1 className="text-3xl font-bold text-center">Authentication Code</h1>

          <input
            className="w-full px-4 py-2 rounded text-white"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
          />

          <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold">
            Verify
          </button>

          {message && <p className="text-center">{message}</p>}
        </form>
      )}
    </main>
  );
}

export default Login;
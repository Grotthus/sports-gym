import { useEffect, useState } from "react";
import { useParams } from "react-router";

async function fetchAdminData(id: number) {
  const response = await fetch(`http://localhost:3005/users/${id}`);
  return await response.json();
}

function Admin() {
  const [user, setUser] = useState<any>(null);
  const { id } = useParams();
  useEffect(() => {
    fetchAdminData(Number(id)).then((data) => {
      setUser(data[0]); // assuming backend returns array
    });
  }, []);

  if (!user) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Welcome {user.Name}
        </h1>

        <p>Email: {user.Email}</p>
        <p>Role: {user.Role}</p>
      </div>
    </main>
  );
}

export default Admin;
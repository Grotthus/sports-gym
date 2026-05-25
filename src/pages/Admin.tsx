import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MembershipCrud from "../components/MembershipCrud";

async function fetchAdminData(id: number) {
  const response = await fetch(`http://localhost:3005/users/${id}`);
  return await response.json();
}

async function fetchMemberships() {
  const response = await fetch("http://localhost:3005/memberships");
  return await response.json();
}

async function fetchUsers() {
  const response = await fetch("http://localhost:3005/users");
  return await response.json();
}

function Admin() {
  const [user, setUser] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

const id = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) return;

    fetchAdminData(Number(id)).then((data) => {
      setUser(data[0]);
    });

    fetchMemberships().then((data) => {
      setMemberships(data);
    });

    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, [id]);

  async function promoteUser(userId: number) {
  const response = await fetch(`http://localhost:3005/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Role: "Admin",
    }),
  });

  if (!response.ok) {
    alert("Failed to promote user");
    return;
  }

  setUsers((prevUsers) =>
    prevUsers.map((u) =>
      u.id_User === userId ? { ...u, Role: "Admin" } : u
    )
  );

  alert("User promoted!");
}

  if (!user) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        <section className="text-center">
          <h1 className="text-4xl font-bold">
            Welcome Admin {user.Name}
          </h1>
        </section>

        {/* Membership Statistics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Membership Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memberships.map((membership) => {

              const memberCount = users.filter(
                (u) =>
                  u.fk_Membershipid_Membership ===
                  membership.id_Membership
              ).length;

              const profit =
                memberCount * membership.BasePrice;

              return (
                <div
                  key={membership.id_Membership}
                  className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-3"
                >
                  <h3 className="text-xl font-bold">
                    {membership.Name}
                  </h3>

                  <p>
                    Members: {memberCount}
                  </p>

                  <p>
                    Profit: €{profit}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Users List */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Customers
          </h2>

          <div className="space-y-4">
            {users.map((u) => (
              <div
                key={u.id_User}
                className="bg-slate-800 p-4 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-bold">
                    {u.Name} {u.LastName}
                  </p>

                  <p className="text-slate-300">
                    {u.Email}
                  </p>

                  <p className="text-sm text-slate-400">
                    Role: {u.Role}
                  </p>
                </div>

                {u.Role !== "Admin" && (
                  <button
                    onClick={() => promoteUser(u.id_User)}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold"
                  >
                    Promote
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

            <MembershipCrud />

      </div>
    </main>
  );
}

export default Admin;
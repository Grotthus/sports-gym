import { useEffect, useState } from "react";
import { useParams } from "react-router";

async function fetchUserData(id: number) {
  const response = await fetch(`http://localhost:3005/users/${id}`);
  return await response.json();
}

async function fetchMemberships() {
  const response = await fetch("http://localhost:3005/memberships");
  return await response.json();
}



function User() {
  const [user, setUser] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    fetchUserData(Number(id)).then((data) => {
      setUser(data[0]);
    });

    fetchMemberships().then((data) => {
      setMemberships(data);
    });
  }, [id]);

  if (!user) {
    return <p className="text-white">Loading...</p>;
  }

  async function chooseMembership(membershipId: number) {
  if (!user || !id) return;

  const response = await fetch(`http://localhost:3005/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: user.Email,
      Name: user.Name,
      LastName: user.LastName,
      Address: user.Address,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role,
      fk_Membershipid_Membership: membershipId,
    }),
  });

  if (!response.ok) {
    alert("Failed to choose membership");
    return;
  }

  setUser({
    ...user,
    fk_Membershipid_Membership: membershipId,
  });

  alert("Membership selected!");
}



  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome {user.Name}</h1>
          <p>Email: {user.Email}</p>
          <p>Role: {user.Role}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Choose a Membership</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memberships.map((membership) => (
              <div
  key={membership.id_Membership}
  className={`
    rounded-xl p-6 space-y-3 border transition
    ${
      membership.id_Membership === user.fk_Membershipid_Membership
        ? "bg-green-900 border-green-500"
        : "bg-slate-800 border-slate-700"
    }
  `}
>
  <h3 className="text-xl font-bold">{membership.Name}</h3>

  <p className="text-slate-300">
    {membership.Description}
  </p>

  <p className="text-2xl font-bold">
    €{membership.BasePrice}
  </p>

  <p className="text-sm text-slate-400">
    Period: {membership.Period} days
  </p>

  <button
    onClick={() => chooseMembership(membership.id_Membership)}
    className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
  >
    Choose
  </button>
</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default User;
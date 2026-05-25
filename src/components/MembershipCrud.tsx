import { useEffect, useState } from "react";

function MembershipCrud() {
  const [memberships, setMemberships] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");

  async function fetchMemberships() {
    const response = await fetch("http://localhost:3005/memberships");
    const data = await response.json();
    setMemberships(data);
  }

  useEffect(() => {
    fetchMemberships();
  }, []);

  async function createMembership() {
    const response = await fetch("http://localhost:3005/memberships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        BasePrice: Number(basePrice),
        Period: Number(period),
        Description: description,
        IsActive: 1,
        fk_Discountid_Discount: null,
      }),
    });

    if (!response.ok) {
      alert("Failed to create membership");
      return;
    }

    await fetchMemberships();

    setName("");
    setBasePrice("");
    setPeriod("");
    setDescription("");
  }

  async function updateMembership(membership: any) {
    const newName = prompt("New name", membership.Name);
    const newPrice = prompt("New price", membership.BasePrice);
    const newPeriod = prompt("New period", membership.Period);
    const newDescription = prompt("New description", membership.Description);

    if (!newName || !newPrice || !newPeriod || !newDescription) return;

    const response = await fetch(
      `http://localhost:3005/memberships/${membership.id_Membership}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: newName,
          BasePrice: Number(newPrice),
          Period: Number(newPeriod),
          Description: newDescription,
        }),
      }
    );

    if (!response.ok) {
      alert("Update failed");
      return;
    }

    await fetchMemberships();
  }

  async function deactivateMembership(id: number) {
    const response = await fetch(
      `http://localhost:3005/memberships/deactivate/${id}`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      alert("Deactivate failed");
      return;
    }

    await fetchMemberships();
  }

  async function deleteMembership(id: number) {
    const response = await fetch(`http://localhost:3005/memberships/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Delete failed");
      return;
    }

    setMemberships((prev) => prev.filter((m) => m.id_Membership !== id));
  }

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">Membership Management</h2>

      <div className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700">
        <h3 className="text-xl font-bold">Create Membership</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="p-3 rounded bg-slate-900 border border-slate-700"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="p-3 rounded bg-slate-900 border border-slate-700"
            placeholder="Base Price"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />

          <input
            className="p-3 rounded bg-slate-900 border border-slate-700"
            placeholder="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />

          <input
            className="p-3 rounded bg-slate-900 border border-slate-700"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          onClick={createMembership}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memberships.map((membership) => (
          <div
            key={membership.id_Membership}
            className="bg-slate-800 p-6 rounded-xl space-y-3 border border-slate-700"
          >
            <h3 className="text-xl font-bold">{membership.Name}</h3>

            <p>€{membership.BasePrice}</p>
            <p>{membership.Description}</p>
            <p>{membership.Period} days</p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateMembership(membership)}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
              >
                Update
              </button>

              <button
                onClick={() => deactivateMembership(membership.id_Membership)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Deactivate
              </button>

              <button
                onClick={() => deleteMembership(membership.id_Membership)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MembershipCrud;
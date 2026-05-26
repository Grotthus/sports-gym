import { useEffect, useState } from "react";

function MembershipCrud() {
  const [memberships, setMemberships] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

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

  function clearForm() {
    setEditingId(null);
    setName("");
    setBasePrice("");
    setPeriod("");
    setDescription("");
  }

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
    clearForm();
  }

  function startEditing(membership: any) {
    setEditingId(membership.id_Membership);
    setName(membership.Name);
    setBasePrice(String(membership.BasePrice));
    setPeriod(String(membership.Period));
    setDescription(membership.Description ?? "");
  }

  async function saveChanges() {
    if (editingId === null) return;

    const response = await fetch(
      `http://localhost:3005/memberships/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          BasePrice: Number(basePrice),
          Period: Number(period),
          Description: description,
        }),
      }
    );

    if (!response.ok) {
      alert("Update failed");
      return;
    }

    await fetchMemberships();
    clearForm();
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
        <h3 className="text-xl font-bold">
          {editingId === null ? "Create Membership" : "Edit Membership"}
        </h3>

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

        <div className="flex gap-3">
          <button
            onClick={editingId === null ? createMembership : saveChanges}
            className={
              editingId === null
                ? "bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold"
                : "bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded font-semibold"
            }
          >
            {editingId === null ? "Create" : "Save Changes"}
          </button>

          {editingId !== null && (
            <button
              onClick={clearForm}
              className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
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
                onClick={() => startEditing(membership)}
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
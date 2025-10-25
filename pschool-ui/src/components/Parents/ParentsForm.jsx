import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function ParentForm({ parent, onSubmit, parents, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (parent) {
      setName(parent.name);
      setEmail(parent.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [parent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check for duplicate parent
    if (!parent && parents.some(p => p.name === name && p.email === email)) {
      setError("Parent with this name and email already exists!");
      return;
    }

    try {
      if (parent) {
        // Update parent
        await api.put(`/parents/${parent.id}`, { name, email });
      } else {
        // Add new parent
        await api.post("/parents", { name, email });
      }
      setName("");
      setEmail("");
      onSubmit();
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to save parent. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      {error && <p className="text-red-500">{error}</p>}
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      {parent ? (
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Parent
        </button>
      )}
    </form>
  );
}

import { useEffect, useState } from "react";
import ParentForm from "../Parents/ParentsForm";
import { api } from "../../api/api";
import { TrashIcon, PencilIcon } from "lucide-react";

export default function ParentsList() {
  const [parents, setParents] = useState([]);
  const [editingParent, setEditingParent] = useState(null);

  const fetchParents = async () => {
    try {
      const res = await api.get("/parents");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setParents(data);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this parent?")) return;
    try {
      await api.delete(`/parents/${id}`);
      setParents((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting parent:", err);
    }
  };

  const handleEdit = (parent) => setEditingParent(parent);

  const handleFormSubmit = () => {
    setEditingParent(null);
    fetchParents();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Parents
      </h1>

      <div className="mb-6">
        <ParentForm
          parent={editingParent}
          onSubmit={handleFormSubmit}
          parents={parents}
          onCancel={() => setEditingParent(null)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 font-bold text-gray-600 mb-2 px-4">
        <span>Name</span>
        <span>Email</span>
        <span>Actions</span>
      </div>

      <ul className="space-y-3">
        {parents.map((parent) => (
          <li
            key={parent.id}
            className="grid grid-cols-3 items-center p-4 bg-gray-50 rounded-md shadow-sm"
          >
            <span className="text-gray-700 font-medium">{parent.name}</span>
            <span className="text-gray-700 font-medium">{parent.email}</span>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(parent)}
                className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(parent.id)}
                className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

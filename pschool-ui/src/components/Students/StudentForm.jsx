import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function StudentForm({ student, parents, onSubmit, students, onCancel }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age);
      setParentId(student.parentId);
    } else {
      setName("");
      setAge("");
      setParentId("");
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!student && students.some(s => s.name === name && s.parentId === parseInt(parentId))) {
      setError("Student with this name under selected parent already exists!");
      return;
    }

    try {
      const payload = { id: student?.id, name, age: parseInt(age), parentId: parseInt(parentId) };
      if (student) {
        await api.put(`/students/${student.id}`, payload);
      } else {
        await api.post("/students", payload);
      }
      setName("");
      setAge("");
      setParentId("");
      onSubmit();
    } catch (err) {
      console.error(err);
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
        placeholder="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <select
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Parent</option>
        {parents.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {student ? (
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
          Add Student
        </button>
      )}
    </form>
  );
}  
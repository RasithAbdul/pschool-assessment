import { useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import { api } from "../../api/api";
import { TrashIcon, PencilIcon } from "lucide-react";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filterParentId, setFilterParentId] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students", {
        params: { parentId: filterParentId || undefined },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await api.get("/parents");
      setParents(res.data);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, [filterParentId]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleEdit = (student) => setEditingStudent(student);

  const handleFormSubmit = () => {
    setEditingStudent(null);
    fetchStudents();
  };

  const filteredStudents = filterParentId
    ? students.filter((s) => s.parentId === parseInt(filterParentId))
    : students;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Students
      </h1>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700 font-medium">
          Filter by Parent
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFilterParentId(e.target.value)}
          value={filterParentId}
        >
          <option value="">All Parents</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          students={students}
          parents={parents}
          onCancel={() => setEditingStudent(null)}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 font-bold text-gray-600 mb-2 px-4">
        <span>Name</span>
        <span>Age</span>
        <span>Parent</span>
        <span>Actions</span>
      </div>

      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No students found</p>
      ) : (
        <ul className="space-y-3">
          {filteredStudents.map((student) => (
            <li
              key={student.id}
              className="grid grid-cols-4 items-center p-4 bg-gray-50 rounded-md shadow-sm"
            >
              <span className="text-gray-700 font-medium">{student.name}</span>
              <span className="text-gray-700 font-medium">{student.age}</span>
              <span className="text-gray-700 font-medium">
                {parents.find((p) => p.id === student.parentId)?.name || "N/A"}
              </span>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

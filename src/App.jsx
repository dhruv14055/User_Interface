import React, { useState, useEffect } from "react";
import Login from "./Login";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzDFademURWrdIgNVfYbY03FtPy1Ux4rzl52Y9XhTDRZreA-c-JghUA5Cz6JpIOTqg/exec"; // Replace with your actual script URL

const App = () => {
  const [user, setUser] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "teacher") {
      fetchRegisteredStudents();
      const interval = setInterval(fetchRegisteredStudents, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchRegisteredStudents = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getRegisteredStudents`);
      const data = await response.json();

      if (data.success && Array.isArray(data.students)) {
        setRegisteredStudents(data.students);
      } else {
        console.error("Failed to fetch students:", data.error);
        setRegisteredStudents([]);
      }
    } catch (error) {
      console.error("Error fetching registered students:", error);
      setRegisteredStudents([]);
    }
  };

  const handleLogin = async (credentials, resetFields) => {
    setLoading(true);

    if (credentials.role === "teacher") {
      const response = await fetch(
        `${SCRIPT_URL}?action=loginTeacher&email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`
      );
      const data = await response.json();

      if (data.success) {
        setUser({ role: "teacher" });
        fetchRegisteredStudents();
      } else {
        alert("❌ Invalid Teacher Credentials");
      }
    } else {
      const response = await fetch(
        `${SCRIPT_URL}?action=loginStudent&regNo=${encodeURIComponent(credentials.registrationNo)}`
      );
      const data = await response.json();

      if (data.success) {
        setUser({ role: "student" });
      } else {
        alert("❌ Invalid Registration Number!");
      }
    }

    resetFields();
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://wallpaperaccess.com/full/32822.jpg')",
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-70 bg-gray-800">
          <div className="text-white text-xl font-bold px-6 py-4 rounded-lg shadow-lg border border-gray-300">
            Loading... Please Wait...
          </div>
        </div>
      )}

      {!user ? (
        <Login onLogin={handleLogin} />
      ) : user.role === "teacher" ? (
        <TeacherDashboard students={registeredStudents} setUser={setUser} />
      ) : (
        <StudentWelcome setUser={setUser} />
      )}
    </div>
  );
};

const TeacherDashboard = ({ students, setUser }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">Teacher Dashboard</h1>

      {/* Scrollable Table for Large Student Lists */}
      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-inner">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 sticky top-0">
              <th className="p-2 border">Registration No</th>
              <th className="p-2 border">Name</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map(({ regNo, name }) => (
                <tr key={regNo} className="border bg-white hover:bg-gray-100">
                  <td className="p-2 border text-center">{regNo}</td>
                  <td className="p-2 border text-center">{name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-2 text-center text-gray-500">
                  No students registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </div>
  );
};

const StudentWelcome = ({ setUser }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-3xl font-bold text-blue-600">Welcome, Student! 🎉</h1>
      <p className="text-gray-700 mt-2">Your attendance has been marked successfully.</p>
      <button
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </div>
  );
};

export default App;
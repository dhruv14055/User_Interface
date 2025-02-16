import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setRegistrationNo("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onLogin(
        isTeacher
          ? { role: "teacher", email: email.trim(), password: password.trim() }
          : { role: "student", registrationNo: registrationNo.trim() },
        resetFields
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-center mb-4">
        <button
          className={`p-2 w-1/2 ${!isTeacher ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => setIsTeacher(false)}
        >
          Student
        </button>
        <button
          className={`p-2 w-1/2 ${isTeacher ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => setIsTeacher(true)}
        >
          Teacher
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Processing...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isTeacher ? (
            <>
              <input
                type="email"
                placeholder="Teacher Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="Registration Number"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isTeacher ? "Login as Teacher" : "Mark Attendance"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;

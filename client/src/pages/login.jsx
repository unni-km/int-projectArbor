import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/login`, form);

      localStorage.setItem("userid", response.data.id);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("roleid", response.data.role);
      localStorage.setItem("username", response.data.username);

      console.log("Login successful, user data stored.");
      navigate("/homepage");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/loginbg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-md transition-transform transform hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-wide">ArborVault</h2>
          <div className="flex justify-center">
            <img
              src="/images/Arborimg.png"
              alt="ArborVault Logo"
              className="w-28 h-28 animate-spin-slow"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login Form">
          <div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-transparent transition"
              aria-label="Username"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-transparent transition"
              aria-label="Password"
            />
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center animate-pulse"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'} text-white py-3 rounded-xl transform transition duration-300 font-semibold flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

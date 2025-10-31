import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5003/api/v1/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("If this email exists, a reset link has been sent to your inbox.");
      } else {
        setMessage("Email not found or something went wrong.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="forgot-container bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-center text-black">
          Forgot Password
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-10 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center space-y-6">
          <div className="w-11/12">
            <label className="block text-sm font-semibold mb-3 text-left">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-11/12 bg-green-600 text-white py-2.5 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200 font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-8 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}

        {/* Back to Login */}
        <p className="text-center mt-10 text-sm">
          <a
            href="/login"
            className="text-black hover:text-green-600 font-semibold transition-colors duration-200"
          >
            ← Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

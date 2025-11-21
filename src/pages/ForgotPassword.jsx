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
        setMessage("A reset password link has been sent to your email, Please check your emil inbox.");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-5">
      {/* ⭐ ใช้ CSS จาก .forgot-container */}
      <div className="forgot-container w-full max-w-xl bg-white p-10 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold mb-2 text-center text-black">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-center mb-10">
          Enter your email and we will send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md
                       hover:bg-green-700 transition font-semibold 
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-6 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
        <p
          style={{ marginTop: "60px" }}
          className="text-center text-sm"
        >
         <a
           href="/login"
           className="text-black hover:text-green-600 font-semibold transition"
         >
    ← Back to Login
  </a>
</p>


      </div>
    </div>
  );
}

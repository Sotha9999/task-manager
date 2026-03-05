import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `https://script.google.com/macros/s/AKfycbwrOjRsobdZuSmGfnNkm-93gpAaohMK67qrvmSeZJnNd_W5mKZL5NvUEJjaka_aVOJ1/exec?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        onLoginSuccess(email);
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      alert("Database connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side: Branding/Hero */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 justify-center items-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-extrabold mb-6">Task Master</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Manage your productivity, fulfill data requirements, and track your progress 
            seamlessly with our Google Sheets integrated platform.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="h-1 w-12 bg-white rounded-full"></div>
            <p className="text-sm font-medium uppercase tracking-wider">Developed by: Mr. In Sotha</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-3xl font-bold text-blue-600">TaskMaster</h1>
          </div>
          
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
              <p className="text-gray-500 mt-2">Please enter your credentials to access your tasks.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  // Added text-black here
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black placeholder:text-gray-400"
                  type="email" 
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Forgot?</a>
                </div>
                <input 
                  // Added text-black here
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
                  type="password" 
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-blue-300 shadow-lg shadow-blue-200"
              >
                {loading ? "Verifying..." : "Sign In"}
              </button>
            </form>
          </div>
          
          <p className="mt-8 text-center text-gray-400 text-sm">
            &copy; 2026 TaskMaster. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
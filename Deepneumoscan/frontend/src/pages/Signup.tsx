import { UserPlus } from "lucide-react";

export default function Signup() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/src/assets/bg-medical.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative bg-white shadow-xl p-10 rounded-2xl w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <UserPlus size={30} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-gray-700 font-medium">Username</label>
            <input
              type="text"
              placeholder="John Doe"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <a href="/login" className="text-blue-600 font-medium ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

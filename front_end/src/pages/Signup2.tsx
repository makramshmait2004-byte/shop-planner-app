import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const Signup2: React.FC = () => {
  const navigate = useNavigate();
  const signup = useStore((state) => state.signup);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    hobbies: "",
    career: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get data from first step
    const step1Data = JSON.parse(localStorage.getItem('signupStep1') || '{}');
    const completeData = { 
      ...step1Data, 
      ...formData,
      dateOfBirth: formData.dateOfBirth || null,
      hobbies: formData.hobbies || null,
      career: formData.career || null,
      location: formData.location || null
    };

    try {
      await signup(completeData);
      localStorage.removeItem('signupStep1'); // Clean up
    } catch (error) {
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8F3CE2] to-[#2C64E6] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Almost Done!
          </h1>
          <p className="text-gray-600">Tell us a bit more about yourself</p>
        </div>

        {/* Additional Info Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F3CE2] focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-2">
              Hobbies
            </label>
            <select
              id="hobbies"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F3CE2] focus:border-transparent outline-none transition bg-white"
            >
              <option value="">Select your hobbies</option>
              <option value="sports">Sports</option>
              <option value="reading">Reading</option>
              <option value="music">Music</option>
              <option value="travel">Travel</option>
              <option value="gaming">Gaming</option>
              <option value="cooking">Cooking</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-2">
              Career
            </label>
            <select
              id="career"
              name="career"
              value={formData.career}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F3CE2] focus:border-transparent outline-none transition bg-white"
            >
              <option value="">Select your profession</option>
              <option value="student">Student</option>
              <option value="engineer">Engineer</option>
              <option value="teacher">Teacher</option>
              <option value="doctor">Doctor</option>
              <option value="artist">Artist</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F3CE2] focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8F3CE2] to-[#2C64E6] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Creating Account..." : "Complete Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup2;
import React, { useState } from "react";
import { useStore } from "../store/useStore";

const Header: React.FC = () => {
  const { user, logout } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between px-6 shadow-sm border-b">
      <div>
        <h1 className="text-2xl font-bold text-[#8F3CE2]">FamList</h1>
        <p className="text-sm text-gray-600">
          Welcome back, <span className="font-semibold">{user?.fullName}</span> • {user?.family?.name}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium text-gray-800">{user?.fullName}</div>
          <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
        </div>
        
        {/* Logout Button with Dropdown Confirmation */}
        <div className="relative">
          <button
            onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>

          {/* Logout Confirmation Dropdown */}
          {showLogoutConfirm && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64 z-50">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Logout from FamList?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  You'll need to sign in again to access your family's shopping list.
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowLogoutConfirm(false)}
        />
      )}
    </header>
  );
};

export default Header;
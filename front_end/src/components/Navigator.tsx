import React from 'react';
import { useStore } from '../store/useStore';

interface NavigatorProps {
  onClose?: () => void;
}

const Navigator: React.FC<NavigatorProps> = ({ onClose }) => {
  const { items = [], addItem, archiveCurrentWeek, familyMembers = [], user } = useStore();
  
  const pendingCount = items.filter(item => !item.completed).length;
  const completedCount = items.filter(item => item.completed).length;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const itemName = formData.get('itemName') as string;
    
    if (itemName?.trim()) {
      try {
        await addItem(itemName.trim());
        form.reset();
        // Close mobile nav after adding item
        if (window.innerWidth < 1024) {
          onClose?.();
        }
      } catch (error) {
        alert('Failed to add item. Please try again.');
      }
    }
  };

  const handleShareFamily = () => {
    const familyLink = `${window.location.origin}/join/${user?.family?.id}`;
    navigator.clipboard.writeText(familyLink).then(() => {
      alert('Family link copied to clipboard! Share it with your family members.');
    });
  };

  return (
    <div className="w-80 lg:w-64 xl:w-80 bg-white min-h-screen lg:min-h-[calc(100vh-5rem)] border-r p-4 lg:p-6 overflow-y-auto">
      {/* Close button for mobile */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Add Item Section */}
      <div className="mb-6 lg:mb-8">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Add New Item</h3>
        <form onSubmit={handleAddItem} className="space-y-2 lg:space-y-3">
          <input
            name="itemName"
            type="text"
            placeholder="What do you need to buy?"
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F3CE2] focus:border-transparent outline-none transition text-sm lg:text-base"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8F3CE2] to-[#2C64E6] text-white py-2 lg:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm lg:text-base"
          >
            Add to List
          </button>
        </form>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 lg:mb-8">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">This Week</h3>
        <div className="grid grid-cols-2 gap-2 lg:gap-3">
          <div className="bg-blue-50 p-2 lg:p-3 rounded-lg text-center">
            <div className="text-xl lg:text-2xl font-bold text-blue-600">{pendingCount}</div>
            <div className="text-xs lg:text-sm text-blue-600">To Buy</div>
          </div>
          <div className="bg-green-50 p-2 lg:p-3 rounded-lg text-center">
            <div className="text-xl lg:text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-xs lg:text-sm text-green-600">Completed</div>
          </div>
        </div>
      </div>

      {/* Family Sharing Section */}
      <div className="mb-6 lg:mb-8">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Family Sharing</h3>
        <div className="space-y-2 lg:space-y-3">
          <button 
            onClick={handleShareFamily}
            className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm lg:text-base"
          >
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#8F3CE2] rounded-full flex items-center justify-center text-white text-xs lg:text-sm">
              🔗
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-gray-900">Share Family Link</div>
              <div className="text-xs lg:text-sm text-gray-500">Copy invite link</div>
            </div>
          </button>
          
          <div className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#2C64E6] rounded-full flex items-center justify-center text-white text-xs lg:text-sm">
              👨‍👩‍👧‍👦
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-gray-900">Family Members</div>
              <div className="text-xs lg:text-sm text-gray-500">{familyMembers.length} people</div>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Week Button */}
      <div className="mt-6 lg:mt-auto">
        <button
          onClick={archiveCurrentWeek}
          className="w-full bg-gradient-to-r from-[#0A6D13] to-[#2C64E6] text-white py-2 lg:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm lg:text-base"
        >
          📦 Archive This Week
        </button>
      </div>
    </div>
  );
};

export default Navigator;
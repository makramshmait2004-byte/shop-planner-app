import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

const MainContent: React.FC = () => {
  const { items, toggleItem, deleteItem, familyMembers, user, loadCurrentList } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        setLoading(true);
        await loadCurrentList();
        setLoading(false);
      }
    };

    initializeData();
  }, [user, loadCurrentList]);

  const pendingItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  const handleToggleItem = async (id: string) => {
    try {
      await toggleItem(id);
    } catch (error) {
      console.error('Error toggling item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-[#F5F8FC] min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F3CE2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#F5F8FC] min-h-[calc(100vh-5rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Family Shopping List
          </h1>
          <p className="text-gray-600">
            Everything your {user?.family?.name} family needs this week, all in one place
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Items Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  To Buy ({pendingItems.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {familyMembers?.length || 0} family members
                </div>
              </div>

              {pendingItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-500">All items completed! Add more items.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className="w-6 h-6 rounded border-2 border-gray-400 hover:border-[#8F3CE2] flex items-center justify-center transition-colors"
                        >
                          {item.completed && '✓'}
                        </button>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 block">{item.name}</span>
                          <span className="text-sm text-gray-500">
                            Added by {item.addedBy.fullName}
                            {item.quantity > 1 && ` • Qty: ${item.quantity}`}
                            {item.category && item.category !== 'Other' && ` • ${item.category}`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Completed ({completedItems.length})
              </h3>
              {completedItems.length > 0 ? (
                <div className="space-y-2">
                  {completedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className="w-5 h-5 rounded border-2 border-green-500 bg-green-500 text-white flex items-center justify-center text-xs"
                        >
                          ✓
                        </button>
                        <span className="text-green-700 font-medium line-through text-sm">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs text-green-600">by {item.addedBy.fullName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm">
                  No completed items yet
                </p>
              )}
            </div>

            {/* Family Members */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Family Members
              </h3>
              <div className="space-y-3">
                {familyMembers.length > 0 ? (
                  familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-[#8F3CE2] to-[#2C64E6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.fullName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.fullName}</div>
                        <div className="text-sm text-gray-500">
                          {items.filter(item => item.addedBy.id === member.id).length} items
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    No family members found
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const listText = items.map(item => 
                      `${item.completed ? '✅' : '⬜'} ${item.name} (by ${item.addedBy.fullName})`
                    ).join('\n');
                    navigator.clipboard.writeText(`FamList Shopping List:\n\n${listText}`).then(() => {
                      alert('Shopping list copied to clipboard!');
                    });
                  }}
                  className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">📋</span>
                  <span>Copy Shopping List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = 'http://localhost:3001/api';

interface Family {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  family: Family;
  role: string;
  familyId: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  completed: boolean;
  skipped: boolean;
  addedBy: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Shopping
  items: ShoppingItem[];
  familyMembers: any[];
  currentList: any;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  addItem: (name: string, quantity?: number, category?: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  archiveCurrentWeek: () => void;
  logout: () => void;
  loadCurrentList: () => Promise<void>;
  loadFamilyMembers: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      items: [],
      familyMembers: [],
      currentList: null,

      login: async (email, password) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            set({ 
              user: data.user, 
              isAuthenticated: true,
              token: data.token
            });
            // Load current list and family members after login
            await get().loadCurrentList();
            await get().loadFamilyMembers();
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('Login failed');
        }
      },

      signup: async (userData) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            set({ 
              user: data.user, 
              isAuthenticated: true,
              token: data.token
            });
            // Load current list and family members after signup
            await get().loadCurrentList();
            await get().loadFamilyMembers();
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          console.error('Signup error:', error);
          throw new Error('Signup failed');
        }
      },

      addItem: async (name, quantity = 1, category = 'Other') => {
        const state = get();
        if (!state.user || !state.token) {
          throw new Error('User not authenticated');
        }

        try {
          const response = await fetch(`${API_BASE_URL}/shopping/${state.user.familyId}/items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
              name,
              quantity,
              category,
              addedById: state.user.id
            }),
          });

          const data = await response.json();

          if (response.ok) {
            await get().loadCurrentList();
          } else {
            throw new Error(data.error || 'Failed to add item');
          }
        } catch (error) {
          console.error('Add item error:', error);
          throw error;
        }
      },

      toggleItem: async (id) => {
        const state = get();
        if (!state.token) return;

        try {
          const currentItem = state.items.find(item => item.id === id);
          if (!currentItem) return;

          const response = await fetch(`${API_BASE_URL}/shopping/items/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
              completed: !currentItem.completed
            }),
          });

          if (response.ok) {
            await get().loadCurrentList();
          } else {
            throw new Error('Failed to update item');
          }
        } catch (error) {
          console.error('Toggle item error:', error);
          throw error;
        }
      },

      deleteItem: async (id) => {
        const state = get();
        if (!state.token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/shopping/items/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${state.token}`
            },
          });

          if (response.ok) {
            await get().loadCurrentList();
          } else {
            throw new Error('Failed to delete item');
          }
        } catch (error) {
          console.error('Delete item error:', error);
          throw error;
        }
      },

      loadCurrentList: async () => {
        const state = get();
        if (!state.user || !state.token) {
          console.log('User or token not available');
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/shopping/${state.user.familyId}/current`, {
            headers: {
              'Authorization': `Bearer ${state.token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            set({ 
              currentList: data,
              items: data.items || []
            });
          } else {
            console.error('Failed to load current list:', response.status);
          }
        } catch (error) {
          console.error('Load current list error:', error);
        }
      },

      loadFamilyMembers: async () => {
        const state = get();
        if (!state.user || !state.token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/families/${state.user.familyId}/members`, {
            headers: {
              'Authorization': `Bearer ${state.token}`
            }
          });

          if (response.ok) {
            const members = await response.json();
            set({ familyMembers: members });
          } else {
            console.error('Failed to load family members:', response.status);
          }
        } catch (error) {
          console.error('Load family members error:', error);
        }
      },

      archiveCurrentWeek: () => {
        console.log('Archive functionality would be implemented here');
        // This would call an archive endpoint
      },

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        token: null,
        items: [],
        familyMembers: [],
        currentList: null
      }),
    }),
    {
      name: 'famlist-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
);
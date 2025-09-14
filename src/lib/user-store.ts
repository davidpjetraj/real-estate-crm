// Simple user data store for managing user profile data
// This is a temporary solution until the backend Account query is fixed

export interface UserData {
  id?: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  status?: string;
  avatar?: string;
  created_at?: string;
}

class UserStore {
  private static instance: UserStore;
  private listeners: Array<() => void> = [];

  private constructor() {}

  static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  // Get user data from localStorage
  getUserData(): UserData | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("user_data");
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  // Save user data to localStorage
  saveUserData(userData: Partial<UserData>): void {
    if (typeof window === "undefined") return;

    const currentData = this.getUserData() || {};
    const updatedData = { ...currentData, ...userData };

    localStorage.setItem("user_data", JSON.stringify(updatedData));
    this.notifyListeners();
  }

  // Update specific fields
  updateUserData(updates: Partial<UserData>): void {
    this.saveUserData(updates);
  }

  // Clear user data
  clearUserData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("user_data");
    this.notifyListeners();
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const userStore = UserStore.getInstance();

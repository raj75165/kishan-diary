import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      // NOTE: This is a local-only implementation for demo purposes.
      // In a production app:
      // 1. Never store passwords in plain text
      // 2. Use secure backend API for registration
      // 3. Implement proper password hashing (bcrypt, argon2)
      // 4. Use secure token-based authentication (JWT)
      // 5. Store only authentication tokens, not passwords
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      // NOTE: This is a local-only implementation for demo purposes.
      // In a production app:
      // 1. Never compare passwords in plain text
      // 2. Use secure backend API for authentication
      // 3. Implement proper password hashing and comparison
      // 4. Use secure token-based authentication (JWT)
      // 5. Implement rate limiting and account lockout
      
      const userData = await AsyncStorage.getItem('user');
      
      if (!userData) {
        return { success: false, error: 'No account found. Please register first.' };
      }

      const existingUser = JSON.parse(userData);
      
      if (existingUser.email === email && existingUser.password === password) {
        setUser(existingUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Keep user data but clear session
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

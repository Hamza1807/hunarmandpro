// Authentication utility functions using API (MongoDB backend)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Save user (signup) - stores in MongoDB via API
export const saveUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        username: userData.username,
        role: userData.role, // 'client' or 'freelancer'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    // Store user in localStorage for session management
    const userResponse = {
      ...data.user,
      id: data.user.id,
    };
    localStorage.setItem('currentUser', JSON.stringify(userResponse));
    
    return userResponse;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login user - authenticates with MongoDB via API
export const loginUser = async (emailOrUsername, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store user in localStorage for session management
    const userResponse = {
      ...data.user,
      id: data.user.id,
    };
    localStorage.setItem('currentUser', JSON.stringify(userResponse));
    
    return userResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user from localStorage (for client-side session)
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// Verify user with backend (optional - for session validation)
export const verifyUser = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me?userId=${currentUser.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // User not found or invalid, clear localStorage
      logoutUser();
      return null;
    }

    // Update localStorage with fresh user data
    const userResponse = {
      ...data.user,
      id: data.user.id,
    };
    localStorage.setItem('currentUser', JSON.stringify(userResponse));
    
    return userResponse;
  } catch (error) {
    console.error('Verify user error:', error);
    // On error, keep current user in localStorage
    return getCurrentUser();
  }
};

// Check if username is available
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-username?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check username');
    }

    return data.available;
  } catch (error) {
    console.error('Check username error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};


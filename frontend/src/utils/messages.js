// Message utility functions

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all conversations for a user
export const getConversations = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get conversations');
    }

    return data;
  } catch (error) {
    console.error('Get conversations error:', error);
    throw error;
  }
};

// Get messages in a conversation
export const getMessages = async (conversationId, userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/messages/conversation/${conversationId}?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get messages');
    }

    return data;
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (messageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    return data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

// Get unread message count
export const getUnreadCount = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/unread-count/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get unread count');
    }

    return data.unreadCount || 0;
  } catch (error) {
    console.error('Get unread count error:', error);
    return 0;
  }
};

// Mark messages as read
export const markAsRead = async (conversationId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/mark-read/${conversationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark as read');
    }

    return data;
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

// Start a new conversation
export const startConversation = async (userId1, userId2) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/start-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId1, userId2 }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to start conversation');
    }

    return data;
  } catch (error) {
    console.error('Start conversation error:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`${API_BASE_URL}/users/profile-picture/${userId}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload profile picture');
    }

    return data;
  } catch (error) {
    console.error('Upload profile picture error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user profile');
    }

    return data.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Search users
export const searchUsers = async (query, userType = null) => {
  try {
    let url = `${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`;
    if (userType) {
      url += `&userType=${userType}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to search users');
    }

    return data.users || [];
  } catch (error) {
    console.error('Search users error:', error);
    return [];
  }
};

// Get all freelancers
export const getAllFreelancers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/freelancers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get freelancers');
    }

    return data.freelancers || [];
  } catch (error) {
    console.error('Get freelancers error:', error);
    return [];
  }
};


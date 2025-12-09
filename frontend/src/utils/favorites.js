// src/utils/favorites.js - Utility functions for managing favorite gigs

const FAVORITES_KEY = 'savedGigs';

// Get all saved favorite gigs
export const getFavoriteGigs = () => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting favorite gigs:', error);
    return [];
  }
};

// Save a gig to favorites
export const saveFavoriteGig = (gig) => {
  try {
    const favorites = getFavoriteGigs();
    
    // Check if gig is already in favorites
    const exists = favorites.find(fav => fav._id === gig._id);
    if (exists) {
      return false; // Already saved
    }

    // Add gig to favorites
    favorites.push({
      _id: gig._id,
      title: gig.title,
      description: gig.description,
      price: gig.price,
      deliveryTime: gig.deliveryTime,
      images: gig.images,
      category: gig.category,
      sellerId: gig.sellerId,
      savedAt: new Date().toISOString()
    });

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error saving favorite gig:', error);
    return false;
  }
};

// Remove a gig from favorites
export const removeFavoriteGig = (gigId) => {
  try {
    const favorites = getFavoriteGigs();
    const filtered = favorites.filter(fav => fav._id !== gigId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing favorite gig:', error);
    return false;
  }
};

// Check if a gig is in favorites
export const isFavorite = (gigId) => {
  try {
    const favorites = getFavoriteGigs();
    return favorites.some(fav => fav._id === gigId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Clear all favorites
export const clearAllFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};

// Get favorites count
export const getFavoritesCount = () => {
  const favorites = getFavoriteGigs();
  return favorites.length;
};
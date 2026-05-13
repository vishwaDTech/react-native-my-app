import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from './AuthContext';

type FavoritesContextType = {
  favorites: string[];
  favoriteItems: any[];
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const fetchFavorites = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/favorites`);
      if (response.data.success) {
        setFavoriteItems(response.data.data);
        const favoriteIds = response.data.data.map((fav: any) => 
          typeof fav === 'string' ? fav : fav._id
        );
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteItems([]);
    }
  }, [token]);

  const toggleFavorite = async (id: string) => {
    if (!token) return;

    try {
      const wasFavorite = favorites.includes(id);
      
      // Optimistic update for the ID list
      if (wasFavorite) {
        setFavorites(favorites.filter(favId => favId !== id));
        setFavoriteItems(favoriteItems.filter(item => item._id !== id));
      }

      const response = await axios.post(`${API_URL}/users/favorites/${id}`);
      if (response.data.success) {
        // We need to re-fetch or the server should return the populated list
        // For simplicity, let's just refresh the full list to ensure we have populated data
        fetchFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      fetchFavorites();
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      favoriteItems, 
      toggleFavorite, 
      isFavorite, 
      loading, 
      refreshFavorites: fetchFavorites 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

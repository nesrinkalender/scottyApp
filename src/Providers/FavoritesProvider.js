import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const FavoritesContext = createContext();
const {Provider, Consumer} = FavoritesContext;

const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const getAsyncStorageItems = async () => {
      const items = await AsyncStorage.getItem('favorites');
      setFavorites(items ? JSON.parse(items) : []);
    };
    getAsyncStorageItems();
  }, []);

  const handleAddFavorites = item => {
    let _favorites = favorites;
    _favorites = [...favorites, item];
    setFavorites(_favorites);
    AsyncStorage.setItem('favorites', JSON.stringify(_favorites));
  };

  return (
    <Provider
      value={{
        favorites,
        addFavorites: handleAddFavorites,
      }}>
      {children}
    </Provider>
  );
};

export {FavoritesContext, FavoritesProvider, Consumer as FavoriteConsumer};

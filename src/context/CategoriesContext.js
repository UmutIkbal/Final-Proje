import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoriesContext = createContext(null);
const STORAGE_KEY = 'categories_v1';

export function CategoriesProvider({ children }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setGroups(JSON.parse(raw));
        }
      } catch (err) {
        console.warn('Kategori verisi okunamadi', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      } catch (err) {
        console.warn('Kategori verisi yazilamadi', err);
      }
    };
    save();
  }, [groups]);

  return (
    <CategoriesContext.Provider value={{ groups, setGroups }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const value = useContext(CategoriesContext);
  if (!value) {
    // Provider disinda kullanimi engellemek icin hata veriyoruz.
    throw new Error('useCategories must be used within CategoriesProvider');
  }
  return value;
}

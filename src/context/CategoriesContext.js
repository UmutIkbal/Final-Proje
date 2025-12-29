import { createContext, useContext, useState } from 'react';

const CategoriesContext = createContext(null);

export function CategoriesProvider({ children }) {
  const [groups, setGroups] = useState([]);

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

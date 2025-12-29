import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionsContext = createContext(null);
const STORAGE_KEY = 'transactions_v1';
const RECURRING_KEY = 'recurring_v1';

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [recurring, setRecurring] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [txRaw, recRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(RECURRING_KEY),
        ]);
        if (txRaw) setTransactions(JSON.parse(txRaw));
        if (recRaw) setRecurring(JSON.parse(recRaw));
      } catch (err) {
        console.warn('Islem verisi okunamadi', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (err) {
        console.warn('Islem verisi yazilamadi', err);
      }
    };
    save();
  }, [transactions]);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(recurring));
      } catch (err) {
        console.warn('Duzenli islem verisi yazilamadi', err);
      }
    };
    save();
  }, [recurring]);

  const value = useMemo(
    () => ({ transactions, setTransactions, recurring, setRecurring }),
    [transactions, recurring]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const value = useContext(TransactionsContext);
  if (!value) {
    // Provider disinda kullanimi engellemek icin hata veriyoruz.
    throw new Error('useTransactions must be used within TransactionsProvider');
  }
  return value;
}

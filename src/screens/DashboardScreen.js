import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Ornek islemler listesi: gelisince API/db ile degisecek.
  const [transactions] = useState([
    { id: '1', title: 'Kahve', amount: -30 },
    { id: '2', title: 'Maas', amount: 1500 },
  ]);
  // Gelir/gider ve bakiye hesaplarini tek yerde topluyoruz.
  const { income, expense, balance } = useMemo(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    // Pozitif tutar = gelir, negatif tutar = gider.
    transactions.forEach((item) => {
      if (item.amount >= 0) {
        incomeTotal += item.amount;
      } else {
        expenseTotal += Math.abs(item.amount);
      }
    });

    // Bakiye = gelir - gider.
    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
    };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Ekran basligi */}
      <Text style={styles.title}>Dashboard</Text>

      {/* Aylik bakiye ozet karti */}
      <View style={styles.card}>
        <Text style={styles.label}>Aylık Bakiye</Text>
        <Text style={styles.value}>{balance} TL</Text>
      </View>

      {/* Gelir ve gider kutulari */}
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.label}>Gelir</Text>
          <Text style={styles.value}>{income} TL</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.label}>Gider</Text>
          <Text style={styles.value}>{expense} TL</Text>
        </View>
      </View>

      {/* Son islemler listesi (ornek) */}
      <View style={styles.list}>
        <Text style={styles.listTitle}>Son İşlemler</Text>
        {transactions.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemAmount}>{item.amount} TL</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
    color: colors.primary,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  smallCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  label: {
    color: colors.secondary,
    marginBottom: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    marginTop: 22,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.text,
  },
  listItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemTitle: {
    color: colors.secondary,
  },
  itemAmount: {
    fontWeight: '600',
    color: colors.primary,
  },
});

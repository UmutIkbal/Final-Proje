import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../theme/colors';

export default function DashboardScreen() {
  const [transactions] = useState([
    { id: '1', title: 'Kahve', amount: -30 },
    { id: '2', title: 'Maas', amount: 1500 },
  ]);
  const { income, expense, balance } = useMemo(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((item) => {
      if (item.amount >= 0) {
        incomeTotal += item.amount;
      } else {
        expenseTotal += Math.abs(item.amount);
      }
    });

    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
    };
  }, [transactions]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Aylık Bakiye</Text>
        <Text style={styles.value}>{balance} TL</Text>
      </View>

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

      <View style={styles.list}>
        <Text style={styles.listTitle}>Son Islemler</Text>
        {transactions.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemAmount}>{item.amount} TL</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  label: {
    color: COLORS.secondary,
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  list: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    color: COLORS.secondary,
  },
  itemAmount: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});

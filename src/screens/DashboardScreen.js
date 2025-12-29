import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionsContext';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transactions } = useTransactions();
  // Gelir/gider ve bakiye hesaplarini tek yerde topluyoruz.
  const { income, expense, balance, recent } = useMemo(() => {
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
    const sorted = [...transactions].sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );

    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
      recent: sorted.slice(0, 5),
    };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
          {recent.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Henüz islem yok</Text>
              <Text style={styles.emptyText}>Islem ekledikce burada gorunecek.</Text>
            </View>
          )}
          {recent.map((item) => {
            const date = item.createdAt ? new Date(item.createdAt) : null;
            const dateText = date ? date.toLocaleDateString() : '';
            const timeText = date
              ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';
            const typeValue = item.type || (item.amount >= 0 ? 'income' : 'expense');

            return (
              <View key={item.id} style={styles.listItem}>
                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemMeta}>{dateText} {timeText}</Text>
                </View>
                <Text
                  style={[
                    styles.itemAmount,
                    typeValue === 'income' ? styles.income : styles.expense,
                  ]}
                >
                  {item.amount} TL
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
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
  itemMeta: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  itemAmount: {
    fontWeight: '600',
    color: colors.primary,
  },
  income: {
    color: colors.income,
  },
  expense: {
    color: colors.expense,
  },
  emptyCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    color: colors.secondary,
  },
});

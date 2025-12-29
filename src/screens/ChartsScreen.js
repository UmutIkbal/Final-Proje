import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ChartsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Grafikler ekraninin basit placeholder'i */}
      {/* Burada kategori bazli harcama dagilimi ve aylik trend grafigi olacak */}
      {/* Chart kutuphanesi eklendiginde bu alanlar grafiklerle degisecek */}
      <Text style={styles.title}>Grafikler</Text>
      <Text style={styles.subtitle}>Kategori bazli analizler buraya gelecek.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kategori Dagilimi</Text>
        <Text style={styles.cardText}>Pie chart burada olacak.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Aylik Trend</Text>
        <Text style={styles.cardText}>Line chart burada olacak.</Text>
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
    marginBottom: 12,
    color: colors.primary,
  },
  subtitle: {
    color: colors.secondary,
    marginBottom: 18,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: colors.primary,
  },
  cardText: {
    color: colors.secondary,
  },
});

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function MarketScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Piyasa ekraninin basit placeholder'i */}
      {/* API entegrasyonu geldiginde bu alana canli kur listesi gelecek */}
      {/* Altin ve doviz fiyatlari burada satir satir gosterilecek */}
      <Text style={styles.title}>Piyasa</Text>
      <Text style={styles.subtitle}>Altin ve doviz fiyatlari buraya.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Canli Kur Verileri</Text>
        <Text style={styles.cardText}>API geldiginde liste burada gorunecek.</Text>
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

import { useEffect, useMemo, useState } from 'react';
import { Keyboard, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function MarketScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const bases = ['USD', 'EUR', 'GBP'];
      const fxResults = await Promise.all(
        bases.map(async (base) => {
          const res = await fetch(
            `https://api.frankfurter.app/latest?from=${base}&to=TRY`
          );
          if (!res.ok) {
            throw new Error(`Kur API hatasi (${base}): ${res.status}`);
          }
          const data = await res.json();
          return {
            base,
            rate: data.rates?.TRY ?? null,
          };
        })
      );

      setRates(fxResults);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onTouchStart={Keyboard.dismiss}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        <View style={styles.content}>
          {/* Piyasa ekraninin basit placeholder'i */}
          <Text style={styles.title}>Piyasa</Text>
          <Text style={styles.subtitle}>USD, EUR, GBP - TRY canli kurlar</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Canli Kur Verileri</Text>
            {loading && <Text style={styles.cardText}>Yukleniyor...</Text>}
            {error ? <Text style={styles.cardText}>{error}</Text> : null}
            {!loading && !error && rates.length === 0 && (
              <Text style={styles.cardText}>Veri yok.</Text>
            )}
            {!loading && !error && rates.map((item) => (
              <View key={item.base} style={styles.rateRow}>
                <Text style={styles.rateName}>{item.base} / TRY</Text>
                <Text style={styles.rateValue}>
                  {item.rate ? item.rate.toFixed(2) : '--'}
                </Text>
              </View>
            ))}
            {lastUpdated ? (
              <Text style={styles.updatedText}>Guncel: {lastUpdated}</Text>
            ) : null}
          </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
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
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rateName: {
    color: colors.secondary,
    fontWeight: '600',
  },
  rateValue: {
    color: colors.text,
    fontWeight: '700',
  },
  updatedText: {
    marginTop: 10,
    color: colors.secondary,
    fontSize: 12,
  },
});

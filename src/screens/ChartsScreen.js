import { useMemo, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ChartsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [assetName, setAssetName] = useState('');
  const [assetPercent, setAssetPercent] = useState('');
  const [allocations, setAllocations] = useState([
    { id: '1', name: 'Stocks', percent: 40 },
    { id: '2', name: 'Crypto', percent: 30 },
    { id: '3', name: 'Cash', percent: 30 },
  ]);

  const totalPercent = allocations.reduce((sum, item) => sum + item.percent, 0);

  const handleAddAllocation = () => {
    const value = Number(assetPercent);
    if (!assetName.trim() || Number.isNaN(value) || value <= 0 || value > 100) {
      return;
    }
    setAllocations((prev) => [
      { id: String(Date.now()), name: assetName.trim(), percent: value },
      ...prev,
    ]);
    setAssetName('');
    setAssetPercent('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onTouchStart={Keyboard.dismiss}
      >
        <View style={styles.content}>
          {/* Grafikler ekraninin basit placeholder'i */}
          {/* Burada kategori bazli harcama dagilimi ve aylik trend grafigi olacak */}
          {/* Chart kutuphanesi eklendiginde bu alanlar grafiklerle degisecek */}
          <Text style={styles.title}>Grafikler</Text>
          <Text style={styles.subtitle}>Kategori bazli analizler buraya gelecek.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Portfoy Dagilimi</Text>
            <Text style={styles.cardText}>
              Hedef yuzdeleri girerek dagilimi takip et.
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Varlik (Orn. Stocks)"
                placeholderTextColor={colors.secondary}
                value={assetName}
                onChangeText={setAssetName}
              />
              <TextInput
                style={styles.input}
                placeholder="Yuzde (0-100)"
                placeholderTextColor={colors.secondary}
                value={assetPercent}
                onChangeText={setAssetPercent}
                keyboardType="numeric"
              />
              <Pressable
                onPress={handleAddAllocation}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>Ekle</Text>
              </Pressable>
            </View>

            <Text style={styles.totalText}>Toplam: {totalPercent}%</Text>
            {totalPercent !== 100 && (
              <Text style={styles.warningText}>
                Uyari: Toplam 100 olmali.
              </Text>
            )}

            <View style={styles.allocationList}>
              {allocations.map((item) => (
                <View key={item.id} style={styles.allocationRow}>
                  <Text style={styles.allocationName}>{item.name}</Text>
                  <Text style={styles.allocationPercent}>{item.percent}%</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Kategori Dagilimi</Text>
            <Text style={styles.cardText}>Pie chart burada olacak.</Text>
          </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aylik Trend</Text>
          <Text style={styles.cardText}>Line chart burada olacak.</Text>
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
  form: {
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: colors.surface,
    color: colors.text,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    transform: [{ scale: 1 }],
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  totalText: {
    marginTop: 8,
    color: colors.text,
    fontWeight: '600',
  },
  warningText: {
    color: colors.secondary,
    marginTop: 4,
  },
  allocationList: {
    marginTop: 10,
    gap: 8,
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  allocationName: {
    color: colors.secondary,
  },
  allocationPercent: {
    color: colors.primary,
    fontWeight: '700',
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
});

import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategories } from '../context/CategoriesContext';
import { useTheme } from '../context/ThemeContext';

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Form alanlari: islem adi, tutar ve tur bilgisi.
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  // Ayarlarda olusturulan gruplari buradan cekiyoruz.
  const { groups } = useCategories();
  // Secilen grup ve kategori (kullanici butonlarla secer).
  const [group, setGroup] = useState('');
  const [category, setCategory] = useState('');
  // Ekranda listelenen islemler (su an local state).
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Kategoriler gelince ilk grubu otomatik sec.
    if (groups.length > 0 && !group) {
      setGroup(groups[0].name);
    }
  }, [groups, group]);

  useEffect(() => {
    // Grup degisince ilk kategoriyi otomatik sec.
    if (!group) {
      setCategory('');
      return;
    }
    const current = groups.find((g) => g.name === group);
    if (current && current.categories.length > 0) {
      setCategory(current.categories[0]);
    } else {
      setCategory('');
    }
  }, [group, groups]);

  const handleAdd = () => {
    // Basit dogrulama: bos alanlar veya gecersiz tutar ekleme.
    const value = Number(amount);
    if (Number.isNaN(value) || value <= 0 || !group || !category) {
      return;
    }

    // Gelir/gider turune gore tutari isaretle.
    const signedAmount = type === 'income' ? value : -value;
    const finalTitle = title.trim() || category;
    // Yeni islem ekle ve formu sifirla.
    setTransactions((prev) => [
      { id: String(Date.now()), title: finalTitle, amount: signedAmount, group, category },
      ...prev,
    ]);
    setTitle('');
    setAmount('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ekran basligi */}
      <Text style={styles.title}>Islemler</Text>
      <Text style={styles.subtitle}>Gelir ve gider listesi buraya gelecek.</Text>

      {/* Yeni islem ekleme formu */}
      <View style={styles.form}>
        {/* Islem adi */}
        <TextInput
          style={styles.input}
          placeholder="İşlem Adı"
          placeholderTextColor={colors.secondary}
          value={title}
          onChangeText={setTitle}
        />
        {/* Tutar */}
        <TextInput
          style={styles.input}
          placeholder="Tutar"
          placeholderTextColor={colors.secondary}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        {/* Kategori secimi (Once Ayarlar ekraninda eklenir) */}
        {groups.length === 0 ? (
          <Text style={styles.emptyText}>
            Once Ayarlar ekranindan kategori ekleyin.
          </Text>
        ) : (
          <>
            {/* Grup secimi */}
            <View style={styles.groupRow}>
              {groups.map((item) => (
                <Pressable
                  key={item.name}
                  onPress={() => setGroup(item.name)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    group === item.name && styles.categoryChipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.categoryText, group === item.name && styles.categoryTextActive]}>
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            {/* Kategori secimi */}
            <View style={styles.categoryRow}>
              {(groups.find((g) => g.name === group)?.categories || []).map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    category === item && styles.categoryChipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {/* Gelir/Gider secimi */}
        <View style={styles.typeRow}>
          <Pressable
            onPress={() => setType('income')}
            style={({ pressed }) => [
              styles.typeButton,
              type === 'income' && styles.typeActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
              Gelir
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setType('expense')}
            style={({ pressed }) => [
              styles.typeButton,
              type === 'expense' && styles.typeActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
              Gider
            </Text>
          </Pressable>
        </View>
        {/* Islem ekle butonu */}
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>Islem Ekle</Text>
        </Pressable>
      </View>

      {/* Islemler listesi */}
      <View style={styles.list}>
        {transactions.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.group} / {item.category}</Text>
            </View>
            <Text style={styles.itemAmount}>
              {item.amount} TL
            </Text>
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
    marginBottom: 12,
    color: colors.primary,
  },
  subtitle: {
    color: colors.secondary,
    marginBottom: 18,
  },
  form: {
    marginBottom: 18,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: colors.surface,
    color: colors.text,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  emptyText: {
    color: colors.secondary,
    marginBottom: 12,
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    transform: [{ scale: 1 }],
  },
  categoryChipActive: {
    backgroundColor: colors.primarySoft,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  categoryText: {
    color: colors.secondary,
    fontSize: 13,
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  typeActive: {
    backgroundColor: colors.primarySoft,
  },
  typeText: {
    color: colors.secondary,
  },
  typeTextActive: {
    color: colors.primary,
    fontWeight: '700',
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
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  list: {
    gap: 10,
  },
  listItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
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
  itemCategory: {
    color: colors.secondary,
    fontSize: 12,
  },
  itemAmount: {
    fontWeight: '600',
    color: colors.primary,
  },
});

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategories } from '../context/CategoriesContext';
import { useTransactions } from '../context/TransactionsContext';
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
  const { transactions, setTransactions, recurring, setRecurring } = useTransactions();
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringDay, setRecurringDay] = useState('1');
  const [recurringGroup, setRecurringGroup] = useState('');
  const [recurringCategory, setRecurringCategory] = useState('');
  const [recurringType, setRecurringType] = useState('expense');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editType, setEditType] = useState('expense');

  const parseAmount = (value) => {
    const normalized = String(value).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(normalized);
  };

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

  useEffect(() => {
    // Duzenli form icin varsayilan grup secimi.
    if (groups.length > 0 && !recurringGroup) {
      setRecurringGroup(groups[0].name);
    }
  }, [groups, recurringGroup]);

  useEffect(() => {
    // Duzenli form icin kategori secimi.
    if (!recurringGroup) {
      setRecurringCategory('');
      return;
    }
    const current = groups.find((g) => g.name === recurringGroup);
    if (current && current.categories.length > 0) {
      setRecurringCategory(current.categories[0]);
    } else {
      setRecurringCategory('');
    }
  }, [recurringGroup, groups]);

  const handleAdd = () => {
    // Basit dogrulama: bos alanlar veya gecersiz tutar ekleme.
    const value = parseAmount(amount);
    if (Number.isNaN(value) || value <= 0 || !group) {
      return;
    }

    // Gelir/gider turune gore tutari isaretle.
    const signedAmount = type === 'income' ? value : -value;
    const finalTitle = title.trim() || category || group;
    // Yeni islem ekle ve formu sifirla.
    setTransactions((prev) => [
      {
        id: String(Date.now()),
        title: finalTitle,
        amount: signedAmount,
        type,
        group,
        category: category || '',
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setTitle('');
    setAmount('');
  };

  const handleDeleteTransaction = (id) => {
    Alert.alert('Islem Sil', 'Bu islemi silmek istiyor musun?', [
      { text: 'Vazgec', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => setTransactions((prev) => prev.filter((tx) => tx.id !== id)),
      },
    ]);
  };

  const handleDeleteRecurring = (id) => {
    Alert.alert('Duzenli Islem Sil', 'Bu duzenli islemi silmek istiyor musun?', [
      { text: 'Vazgec', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => setRecurring((prev) => prev.filter((item) => item.id !== id)),
      },
    ]);
  };
  const handleAddRecurring = () => {
    // Duzenli islem ekleme: tutar, grup ve kategori zorunlu.
    const value = parseAmount(recurringAmount);
    const day = Number(recurringDay);
    if (Number.isNaN(value) || value <= 0 || !recurringGroup) {
      return;
    }
    if (Number.isNaN(day) || day < 1 || day > 28) {
      return;
    }

    const finalTitle = recurringCategory || recurringGroup;
    const signedAmount = recurringType === 'income' ? value : -value;
    setRecurring((prev) => [
      {
        id: String(Date.now()),
        title: finalTitle,
        amount: signedAmount,
        type: recurringType,
        group: recurringGroup,
        category: recurringCategory || '',
        dayOfMonth: day,
        lastApplied: null,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setRecurringAmount('');
  };

  useEffect(() => {
    // Aylik duzenli islemleri otomatik ekle.
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const today = now.getDate();

    if (recurring.length === 0) return;

    let updated = false;
    const nextRecurring = recurring.map((item) => {
      if (item.lastApplied === currentKey) return item;
      if (today < item.dayOfMonth) return item;

      // Bu ay icin ilk kez ekliyoruz.
      updated = true;
      const txId = `${item.id}-${currentKey}`;
      setTransactions((prev) => {
        if (prev.some((tx) => tx.id === txId)) {
          return prev;
        }
        return [
          {
            id: txId,
            title: item.title,
            amount: item.amount,
            type: item.type || (item.amount >= 0 ? 'income' : 'expense'),
            group: item.group,
            category: item.category,
            createdAt: Date.now(),
          },
          ...prev,
        ];
      });
      return { ...item, lastApplied: currentKey };
    });

    if (updated) {
      setRecurring(nextRecurring);
    }
  }, [recurring]);

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    if (filter === 'all') return sorted;
    return sorted.filter((item) => {
      const inferred = item.type || (item.amount >= 0 ? 'income' : 'expense');
      return inferred === filter;
    });
  }, [transactions, filter]);

  const openEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title || '');
    setEditAmount(String(Math.abs(item.amount)));
    setEditType(item.type || (item.amount >= 0 ? 'income' : 'expense'));
  };

  const handleSaveEdit = () => {
    const value = parseAmount(editAmount);
    if (Number.isNaN(value) || value <= 0) return;
    const signed = editType === 'income' ? value : -value;
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === editingId
          ? {
              ...tx,
              title: editTitle.trim() || tx.title,
              amount: signed,
              type: editType,
              updatedAt: Date.now(),
            }
          : tx
      )
    );
    setEditingId('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onTouchStart={Keyboard.dismiss}
      >
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

      {/* Duzenli islem ekleme formu */}
      <View style={styles.form}>
        <Text style={styles.sectionLabel}>Duzenli Islem</Text>
        {groups.length === 0 ? (
          <Text style={styles.helperText}>
            Duzenli gider icin once kategori ekleyin.
          </Text>
        ) : (
          <>
            <View style={styles.groupRow}>
              {groups.map((item) => (
                <Pressable
                  key={item.name}
                  onPress={() => setRecurringGroup(item.name)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    recurringGroup === item.name && styles.categoryChipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.categoryText, recurringGroup === item.name && styles.categoryTextActive]}>
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.categoryRow}>
              {(groups.find((g) => g.name === recurringGroup)?.categories || []).map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setRecurringCategory(item)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    recurringCategory === item && styles.categoryChipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.categoryText, recurringCategory === item && styles.categoryTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="Tutar"
          placeholderTextColor={colors.secondary}
          value={recurringAmount}
          onChangeText={setRecurringAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Ay gunu (1-28)"
          placeholderTextColor={colors.secondary}
          value={recurringDay}
          onChangeText={setRecurringDay}
          keyboardType="numeric"
        />
        <View style={styles.typeRow}>
          <Pressable
            onPress={() => setRecurringType('income')}
            style={({ pressed }) => [
              styles.typeButton,
              recurringType === 'income' && styles.typeActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.typeText, recurringType === 'income' && styles.typeTextActive]}>
              Gelir
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setRecurringType('expense')}
            style={({ pressed }) => [
              styles.typeButton,
              recurringType === 'expense' && styles.typeActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.typeText, recurringType === 'expense' && styles.typeTextActive]}>
              Gider
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={handleAddRecurring}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>Duzenli Ekle</Text>
        </Pressable>
      </View>

      {/* Duzenli islem listesi */}
      {recurring.length > 0 && (
        <View style={styles.list}>
          <Text style={styles.sectionLabel}>Duzenli Islemler</Text>
          {recurring.map((item) => (
            <Pressable
              key={item.id}
              style={styles.listItem}
              onLongPress={() => handleDeleteRecurring(item.id)}
            >
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemCategory}>
                  {item.category || item.group} / Ayin {item.dayOfMonth}. gunu
                </Text>
              </View>
              <Text
                style={[
                  styles.itemAmount,
                  item.amount >= 0 ? styles.income : styles.expense,
                ]}
              >
                {item.amount} TL
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Islemler listesi */}
      <View style={styles.list}>
        <Text style={styles.sectionLabel}>Islemler</Text>
        {/* Filtre */}
        <View style={styles.filterRow}>
          {['all', 'income', 'expense'].map((key) => (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              style={({ pressed }) => [
                styles.filterChip,
                filter === key && styles.filterChipActive,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
                {key === 'all' ? 'Tumu' : key === 'income' ? 'Gelir' : 'Gider'}
              </Text>
            </Pressable>
          ))}
        </View>
        {filteredTransactions.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Henüz islem yok</Text>
            <Text style={styles.emptyText}>Ilk islemini ekleyerek basla.</Text>
          </View>
        )}
        {filteredTransactions.map((item) => {
          const date = item.createdAt ? new Date(item.createdAt) : null;
          const dateText = date ? date.toLocaleDateString() : '';
          const timeText = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          const typeValue = item.type || (item.amount >= 0 ? 'income' : 'expense');

          return (
            <Pressable
              key={item.id}
              style={styles.listItem}
              onPress={() => openEdit(item)}
              onLongPress={() => handleDeleteTransaction(item.id)}
            >
              <View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemCategory}>{item.group} / {item.category || 'Genel'}</Text>
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
            </Pressable>
          );
        })}
      </View>
      <Modal visible={Boolean(editingId)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Islem Duzenle</Text>
            <TextInput
              style={styles.input}
              placeholder="Islem Adi"
              placeholderTextColor={colors.secondary}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Tutar"
              placeholderTextColor={colors.secondary}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
            />
            <View style={styles.typeRow}>
              <Pressable
                onPress={() => setEditType('income')}
                style={({ pressed }) => [
                  styles.typeButton,
                  editType === 'income' && styles.typeActive,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={[styles.typeText, editType === 'income' && styles.typeTextActive]}>
                  Gelir
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setEditType('expense')}
                style={({ pressed }) => [
                  styles.typeButton,
                  editType === 'expense' && styles.typeActive,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={[styles.typeText, editType === 'expense' && styles.typeTextActive]}>
                  Gider
                </Text>
              </Pressable>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setEditingId('')}
                style={({ pressed }) => [
                  styles.ghostButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.ghostText}>Iptal</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveEdit}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>Kaydet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  form: {
    marginBottom: 18,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: colors.primarySoft,
  },
  filterText: {
    color: colors.secondary,
    fontSize: 13,
  },
  filterTextActive: {
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  helperText: {
    color: colors.secondary,
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
  },
  ghostText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

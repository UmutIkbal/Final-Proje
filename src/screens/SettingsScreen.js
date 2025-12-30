import { useMemo, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategories } from '../context/CategoriesContext';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Global kategori listesi (gruplar ve kategoriler).
  const { groups, setGroups } = useCategories();
  // UI state: secili grup ve input degerleri.
  const [selectedGroup, setSelectedGroup] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showDeleteGroup, setShowDeleteGroup] = useState('');
  const [showDeleteCategory, setShowDeleteCategory] = useState('');
  const longPressRef = useRef(false);
  const clearDeleteButtons = () => {
    setShowDeleteGroup('');
    setShowDeleteCategory('');
  };
  const dismissAll = () => {
    Keyboard.dismiss();
    clearDeleteButtons();
  };
  const handleTouchEnd = () => {
    if (longPressRef.current) {
      longPressRef.current = false;
      return;
    }
    clearDeleteButtons();
  };

  const handleAddGroup = () => {
    // Bos giris veya ayni isim varsa ekleme.
    // Yeni grup ekleme: bos ya da ayni isim varsa ekleme.
    if (!newGroup.trim()) return;
    const name = newGroup.trim();
    if (groups.some((g) => g.name === name)) return;
    setGroups([...groups, { name, categories: [] }]);
    setSelectedGroup(name);
    setNewGroup('');
  };

  const handleAddCategory = () => {
    // Secili grup yoksa veya bos isimse ekleme.
    // Secilen gruba yeni kategori ekleme.
    if (!selectedGroup || !newCategory.trim()) return;
    const name = newCategory.trim();
    setGroups((prev) =>
      prev.map((g) => {
        if (g.name !== selectedGroup) return g;
        if (g.categories.includes(name)) return g;
        return { ...g, categories: [...g.categories, name] };
      })
    );
    setNewCategory('');
  };

  const handleDeleteGroup = (name) => {
    // Grubu ve icindeki tum kategorileri sil.
    setGroups((prev) => prev.filter((g) => g.name !== name));
    if (selectedGroup === name) {
      setSelectedGroup('');
    }
    if (showDeleteGroup === name) {
      setShowDeleteGroup('');
    }
  };

  const handleDeleteCategory = (name) => {
    // Secili gruptan kategori sil.
    if (!selectedGroup) return;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.name !== selectedGroup) return g;
        return { ...g, categories: g.categories.filter((c) => c !== name) };
      })
    );
    if (showDeleteCategory === name) {
      setShowDeleteCategory('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onTouchStart={Keyboard.dismiss}
        onTouchEnd={handleTouchEnd}
      >
        <View style={styles.content}>
        {/* Ekran basligi */}
        <Text style={styles.title}>Ayarlar</Text>

        <View style={styles.section}>
          {/* Tema degistirme alani */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Karanlik Mod</Text>
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                styles.toggleButton,
                isDark && styles.toggleButtonActive,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={18}
                color={colors.primary}
              />
            </Pressable>
          </View>

          {/* Kategori yonetimi basligi */}
          <Text style={styles.sectionTitle}>Kategori Yonetimi</Text>

          <View style={styles.row}>
            {/* Yeni grup girisi */}
            <TextInput
              style={styles.input}
              placeholder="Grup ekle (Orn. Abonelik)"
              placeholderTextColor={colors.secondary}
              value={newGroup}
              onChangeText={setNewGroup}
            />
            {/* Grup ekle butonu */}
            <Pressable
              onPress={handleAddGroup}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Ekle</Text>
            </Pressable>
          </View>

          <View style={styles.groupRow}>
            {/* Grup secim chipleri */}
            {groups.map((item) => (
              <Pressable
                key={item.name}
                style={({ pressed }) => [
                  styles.chip,
                  selectedGroup === item.name && styles.chipActive,
                  pressed && styles.chipPressed,
                ]}
              onPress={() => setSelectedGroup(item.name)}
              onLongPress={() => {
                longPressRef.current = true;
                setShowDeleteGroup(item.name);
              }}
            >
                <View style={styles.chipRow}>
                  <Text style={[styles.chipText, selectedGroup === item.name && styles.chipTextActive]}>
                    {item.name}
                  </Text>
                  {showDeleteGroup === item.name && (
                    <Pressable
                      onPress={() => handleDeleteGroup(item.name)}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && styles.deletePressed,
                      ]}
                    >
                      <Text style={styles.deleteText}>Sil</Text>
                    </Pressable>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            {/* Yeni kategori girisi */}
            <TextInput
              style={styles.input}
              placeholder="Kategori ekle (Orn. Netflix)"
              placeholderTextColor={colors.secondary}
              value={newCategory}
              onChangeText={setNewCategory}
            />
            {/* Kategori ekle butonu */}
            <Pressable
              onPress={handleAddCategory}
              disabled={!selectedGroup}
              style={({ pressed }) => [
                styles.button,
                !selectedGroup && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Ekle</Text>
            </Pressable>
          </View>

          <View style={styles.categoryList}>
            {/* Secili gruba ait kategori listesi */}
            {(groups.find((g) => g.name === selectedGroup)?.categories || []).map((item) => (
              <Pressable
                key={item}
              style={styles.categoryRow}
              onLongPress={() => {
                longPressRef.current = true;
                setShowDeleteCategory(item);
              }}
            >
                <Text style={styles.categoryItem}>{item}</Text>
                {showDeleteCategory === item && (
                  <Pressable
                    onPress={() => handleDeleteCategory(item)}
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed && styles.deletePressed,
                    ]}
                  >
                    <Text style={styles.deleteText}>Sil</Text>
                  </Pressable>
                )}
              </Pressable>
            ))}
          </View>
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
    marginBottom: 18,
    color: colors.primary,
  },
  section: {
    marginTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  content: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  toggleButtonActive: {
    backgroundColor: colors.primarySoft,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.text,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  button: {
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    transform: [{ scale: 1 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
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
  chipActive: {
    backgroundColor: colors.primarySoft,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    color: colors.secondary,
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryList: {
    marginTop: 10,
    gap: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  categoryItem: {
    color: colors.secondary,
    fontSize: 14,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },
  deletePressed: {
    transform: [{ scale: 0.98 }],
  },
  deleteText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
});

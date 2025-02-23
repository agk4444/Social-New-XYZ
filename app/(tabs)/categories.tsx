import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCategories } from '../utils/api';
import type { WordPressCategory } from '../types/wordpress';
import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data.filter(cat => cat.count > 0));
      setError(null);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCategories} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push(`/category/${item.id}`)}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryCount}>{item.count} posts</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  list: {
    padding: 16,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
});
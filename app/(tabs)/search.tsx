import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { fetchPosts } from '../utils/api';
import PostCard from '../components/PostCard';
import type { WordPressPost } from '../types/wordpress';
import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    if (!query.trim()) {
      setPosts([]);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchPosts(1, undefined, query);
      setPosts(results);
      setError(null);
    } catch (err) {
      setError('Failed to search posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            handleSearch(text);
          }}
          returnKeyType="search"
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={() => handleSearch(searchQuery)} />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  list: {
    paddingVertical: 8,
  },
});
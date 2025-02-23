import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchPosts } from '../utils/api';
import PostCard from '../components/PostCard';
import type { WordPressPost } from '../types/wordpress';
import ErrorView from '../components/ErrorView';
import LoadingView from '../components/LoadingView';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function loadPosts(pageNum = 1, refresh = false) {
    try {
      const newPosts = await fetchPosts(pageNum, Number(id));
      setPosts(prev => refresh ? newPosts : [...prev, ...newPosts]);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [id]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage);
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={() => loadPosts(1, true)} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
    paddingVertical: 8,
  },
});
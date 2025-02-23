import { Platform, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { WordPressPost } from '../types/wordpress';

interface PostCardProps {
  post: WordPressPost;
}

export default function PostCard({ post }: PostCardProps) {
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.title.rendered}\n${post.link}`,
        url: post.link, // iOS only
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.card}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      <View style={styles.content}>
        <Link href={post.link} asChild>
          <TouchableOpacity>
            <Text style={styles.title}>{post.title.rendered}</Text>
          </TouchableOpacity>
        </Link>
        <Text 
          style={styles.excerpt}
          numberOfLines={3}
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1c1c1e',
  },
  excerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  shareButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    padding: 8,
  },
});
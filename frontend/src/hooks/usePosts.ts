import { useQuery } from '@tanstack/react-query';
import { fetchPosts, fetchPost } from '../services/api';

// Hook para obtener posts
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
};

// Hook para obtener un post específico
export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
};

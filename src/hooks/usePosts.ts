import { useQuery } from '@tanstack/react-query';
import { alovaInstance } from '../services/alova';
import type { Post } from '../services/alova';

// Hook para obtener posts usando AlovaJS
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const response = await alovaInstance.Get('/posts').send();
      return response as Post[];
    },
  });
};

// Hook para obtener un post específico
export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async (): Promise<Post> => {
      const response = await alovaInstance.Get(`/posts/${id}`).send();
      return response as Post;
    },
    enabled: !!id,
  });
};

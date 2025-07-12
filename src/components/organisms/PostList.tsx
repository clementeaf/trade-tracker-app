import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import { getRelativeTime } from '../../utils/dateUtils';

const PostList: React.FC = () => {
  const { data: posts, isLoading, error, refetch } = usePosts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card title="Error" className="border-red-200 bg-red-50">
        <p className="mb-4 text-red-600">
          Error al cargar los posts: {error.message}
        </p>
        <Button onClick={() => refetch()} variant="primary">
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Posts de Ejemplo</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Actualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts?.slice(0, 6).map((post) => (
          <Card
            key={post.id}
            title={post.title}
            subtitle={`ID: ${post.id} • ${getRelativeTime(new Date())}`}
            className="transition-shadow duration-200 hover:shadow-lg"
          >
            <p className="line-clamp-3 text-sm text-gray-600">{post.body}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Usuario: {post.userId}
              </span>
              <Button size="sm" variant="secondary">
                Ver más
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostList;

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostList from './PostList';

// Mockear fetch global para simular la API
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Post 1', body: 'Contenido 1', userId: 1 },
        { id: 2, title: 'Post 2', body: 'Contenido 2', userId: 2 },
      ]),
    })
  ) as any;
});

describe('PostList', () => {
  it('muestra posts obtenidos de la API', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <PostList />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });
}); 
// Configuración base de la API
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Tipos para las respuestas de la API
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Función para obtener posts
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Error al obtener posts');
  }
  return response.json();
};

// Función para obtener un post específico
export const fetchPost = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener el post');
  }
  return response.json();
}; 
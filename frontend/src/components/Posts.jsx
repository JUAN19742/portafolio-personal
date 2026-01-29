import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

export default function Posts() {
  const { data: posts, loading, error } = useFetch('/posts');

  if (loading) return <p className="text-center">Cargando posts...</p>;
  if (error) return <p className="text-center">Error al cargar los posts</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Blog Técnico</h2>

      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id}>
            <article className="p-4 border rounded-lg shadow-sm">
              <Link
                to={`/posts/${post.id}`}
                className="text-lg font-semibold text-blue-600"
                aria-label={`Leer post ${post.title}`}
              >
                {post.title}
              </Link>

              <p className="text-sm text-gray-500 mt-1">
                {post.date}
              </p>

              <p className="mt-2 text-gray-700">
                {post.content.slice(0, 150)}...
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

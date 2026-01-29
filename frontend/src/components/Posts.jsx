import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

export default function Posts() {
  const { data: response, loading, error } = useFetch('/posts');

  if (loading) return <p className="text-center">Cargando posts...</p>;
  if (error) return <p className="text-center text-red-600">Error al cargar los posts</p>;

  const posts = response?.data || [];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Blog Técnico</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No hay posts publicados aún.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id}>
              <article className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                  aria-label={`Leer post ${post.title}`}
                >
                  {post.title}
                </Link>

                <div className="flex gap-4 text-sm text-gray-500 mt-2">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.readingTime} min lectura</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {post.category}
                  </span>
                </div>

                <p className="mt-2 text-gray-700">
                  {post.excerpt || post.content.slice(0, 200)}...
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

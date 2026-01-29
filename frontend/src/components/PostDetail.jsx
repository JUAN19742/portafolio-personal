import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

export default function PostDetail() {
  const { id } = useParams();
  const { data: response, loading, error } = useFetch(`/posts/${id}`);

  if (loading) return <p className="text-center py-8">Cargando post...</p>;
  if (error) return <p className="text-center text-red-600 py-8">Error al cargar el post</p>;

  const post = response?.data;
  if (!post) return null;

  return (
    <main className="max-w-3xl mx-auto p-4 py-8">
      <Link
        to="/posts"
        className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
        aria-label="Volver al listado de posts"
      >
        ← Volver al blog
      </Link>

      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.readingTime} min lectura</span>
            <span>•</span>
            <span>{post.views || 0} vistas</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
              {post.category}
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        {post.author && (
          <footer className="mt-8 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.author.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{post.author.username}</p>
                <p className="text-sm text-gray-600">{post.author.email}</p>
              </div>
            </div>
          </footer>
        )}
      </article>
    </main>
  );
}

import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

export default function PostDetail() {
  const { id } = useParams();
  const { data: post, loading, error } = useFetch(`/posts/${id}`);

  if (loading) return <p className="text-center">Cargando post...</p>;
  if (error) return <p className="text-center">Error al cargar el post</p>;
  if (!post) return null;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <Link
        to="/posts"
        className="text-sm text-blue-600 mb-4 inline-block"
        aria-label="Volver al listado de posts"
      >
        ← Volver al blog
      </Link>

      <h2 className="text-2xl font-bold mb-1">
        {post.title}
      </h2>

      <p className="text-gray-500 mb-4">
        {post.date}
      </p>

      <article className="leading-relaxed">
        <pre className="whitespace-pre-wrap">
          {post.content}
        </pre>
      </article>
    </main>
  );
}

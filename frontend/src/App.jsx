import { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import Posts from './components/Posts.jsx';
import PostDetail from './components/PostDetail.jsx';
import CV from './components/CV.jsx';

export default function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-white text-black'
      }`}
    >

      <header className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Portafolio Personal</h1>
          <nav className="flex gap-4 mt-2" aria-label="Main navigation">
            <Link to="/" className="text-blue-600 hover:underline">
              Inicio
            </Link>
            <Link to="/posts" className="text-blue-600 hover:underline">
              Blog
            </Link>
          </nav>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
        </button>
      </header>

      {/* CONTENIDO */}
      <main className="p-4">
        <Routes>
          <Route path="/" element={<CV />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  );
}

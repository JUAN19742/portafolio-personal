import { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Posts from './components/Posts.jsx';
import PostDetail from './components/PostDetail.jsx';
import CV from './components/CV.jsx';
import Login from './components/Login.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import PostEditor from './components/PostEditor.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();

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
            {user && (
              <Link to="/admin" className="text-blue-600 hover:underline">
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="p-4">
        <Routes>
          <Route path="/" element={<CV />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas de administración */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <ProtectedRoute requireAdmin>
                <PostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
                <PostEditor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

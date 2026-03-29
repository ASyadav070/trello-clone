import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBoards } from '../services/boardService';
import useBoardStore from '../store/useBoardStore';

export default function HomePage() {
  const { boards, setBoards } = useBoardStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getAllBoards();
        setBoards(data);
      } catch (err) {
        console.error("Failed to load boards", err);
        setError("Unable to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoards();
  }, [setBoards]);

  if (loading) return <main style={{ padding: '2rem', color: 'white' }}>Loading boards...</main>;
  if (error) return <main style={{ padding: '2rem', color: 'var(--color-danger)' }}>{error}</main>;

  return (
    <main style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', marginBottom: '1.5rem' }}>Your Workspaces</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {boards.map(board => (
          <Link 
            key={board.id} 
            to={`/board/${board.id}`} 
            style={{
              padding: '1.5rem',
              backgroundColor: board.background || 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: 'var(--radius-card)',
              textDecoration: 'none',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '500',
              boxShadow: 'var(--shadow-card)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {board.title}
          </Link>
        ))}
      </div>
    </main>
  );
}

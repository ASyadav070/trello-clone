
import useBoardStore from '../../../store/useBoardStore';
import BoardCanvas from '../../../components/Board/BoardCanvas';
import useBoard from '../../../hooks/useBoard';
import CardDetailModal from '../../../components/CardDetail/CardDetailModal';
import BoardHeader from '../../../components/Board/BoardHeader';

export default function BoardPage({ params }) {
  const boardId = params.boardId;
  const { isLoading, error } = useBoard(boardId);
  const { activeBoard } = useBoardStore();

  if (isLoading) return <div style={{ padding: '2rem', color: 'white' }}>Authenticating Workspace & Loading Board Data...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--color-danger)', backgroundColor: 'white' }}>{error}</div>;
  if (!activeBoard) return null;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: activeBoard.background || 'var(--color-bg-board)' }}>
      {/* Board Header Navigation & Search Controls */}
      <BoardHeader />

      {/* Main Workspace / Canvas container */}
      <main style={{ 
        flex: 1, 
        padding: '1rem', 
        overflowX: 'auto', 
        display: 'flex',
        alignItems: 'flex-start'
      }}>
        <BoardCanvas />
      </main>

      {/* Global Z-Index Rooted Modal strictly bypassing layout scrolling locks */}
      <CardDetailModal />
    </div>
  );
}

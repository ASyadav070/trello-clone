import '../styles/globals.css';

export const metadata = {
  title: 'My Project Board - Trello Clone',
  description: 'Kanban-style project management tool developed as a fullstack assignment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="modal-root"></div>
        {children}
      </body>
    </html>
  );
}

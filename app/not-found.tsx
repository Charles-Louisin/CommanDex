export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 font-heading">404</h1>
        <p className="text-text-muted mb-6">Page not found</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}


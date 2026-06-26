export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 – Page Not Found</title>
        <link rel="stylesheet" href="/Assets/plugins/bootstrap.min.css" />
      </head>
      <body style={{ background: '#111', color: '#fff', textAlign: 'center', paddingTop: '15vh', fontFamily: 'sans-serif' }}>
        <span className="logoInterspace" style={{ display: 'inline-block', marginBottom: '2rem' }}></span>
        <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0 }}>404</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.7 }}>Page not found</p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 4,
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Back to Home
        </a>
      </body>
    </html>
  )
}

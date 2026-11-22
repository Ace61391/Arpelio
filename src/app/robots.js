export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // teacher and student pages for online quizzes: nothing there for a search engine
        disallow: ['/dashboard', '/login', '/q/', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://arpelio.com/sitemap.xml',
  };
}

export const metadata = {
  title: 'EGX Daily Report',
  description: 'رفع وتحليل تقارير البورصة المصرية',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}

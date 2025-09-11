import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Nigerian National Grid Monitor" />
        <meta name="description" content="Real-time monitoring dashboard for Nigeria's National Grid. Track power generation, demand, grid status, and outages by location with interactive charts and DISCO zone mapping." />
        <meta name="keywords" content="Nigeria, National Grid, Power, Electricity, DISCO, GENCO, Grid Monitoring, Power Outage, TCN, NISO" />
        <meta name="author" content="Nigerian Grid Monitor" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://natgrid-monitor.vercel.app/" />
        <meta property="og:title" content="Nigerian National Grid Monitor" />
        <meta property="og:description" content="Real-time monitoring dashboard for Nigeria's National Grid. Track power generation, demand, grid status, and outages by location." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://natgrid-monitor.vercel.app/" />
        <meta property="twitter:title" content="Nigerian National Grid Monitor" />
        <meta property="twitter:description" content="Real-time monitoring dashboard for Nigeria's National Grid. Track power generation, demand, grid status, and outages by location." />
        <meta property="twitter:image" content="/twitter-image.png" />

        {/* Favicon and Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://niggrid.org" />

        {/* PWA support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NG Grid Monitor" />
        <meta name="theme-color" content="#3B82F6" />

        {/* Structured Data for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Nigerian National Grid Monitor",
              "description": "Real-time monitoring dashboard for Nigeria's National Grid",
              "url": "https://natgrid-monitor.vercel.app",
              "applicationCategory": "Utility",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Nigerian Grid Monitor"
              }
            })
          }}
        />
      </Head>
      <body>
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}>
            <div style={{
              maxWidth: '400px',
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>JavaScript Required</h1>
              <p style={{ color: '#6b7280', lineHeight: 1.5 }}>
                Nigerian National Grid Monitor requires JavaScript to display real-time grid data and interactive charts.
                Please enable JavaScript in your browser settings and refresh this page.
              </p>
            </div>
          </div>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
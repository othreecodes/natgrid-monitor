import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // @ts-ignore
    // @ts-ignore
    return (
    <>
      <Head>
        <title>Nigerian National Grid Monitor</title>
        <meta name="description" content="Real-time monitoring dashboard for Nigeria's National Grid" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Google Maps Script */}
      {googleMapsApiKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initGoogleMaps&loading=async`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Google Maps script loaded successfully');
            // Set up the callback function
            (window as any).initGoogleMaps = () => {
              console.log('Google Maps API initialized and ready to use');
              // Dispatch custom event to notify components
              window.dispatchEvent(new CustomEvent('googleMapsReady'));
            };
            
            // If google is already available, call the callback immediately
            if (window.google && window.google.maps) {
              (window as any).initGoogleMaps();
            }
          }}
          onError={(e) => {
            console.error('Failed to load Google Maps script:', e);
          }}
        />
      ) : (
        <div style={{ display: 'none' }}>
        </div>
      )}

      <Component {...pageProps} />
    </>
  );
}
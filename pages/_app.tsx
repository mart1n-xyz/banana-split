import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

// Add a simple Modal component
const InvalidEmailModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto p-8 transform transition-all">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Invalid Email Domain
          </h3>
          <div className="mx-auto mb-6 w-12 h-12 flex items-center justify-center bg-red-100 rounded-full">
            <svg 
              className="w-6 h-6 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-8">
            Please use an <span className="font-semibold">@status.im</span> email address to login.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#4A2B1B] text-white px-6 py-3 rounded-lg font-medium 
                     hover:bg-opacity-90 transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A2B1B]"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component to handle auth validation
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, ready } = usePrivy();
  const [showInvalidEmailModal, setShowInvalidEmailModal] = useState(false);

  useEffect(() => {
    if (!ready) return;

    const checkEmail = async () => {
      const email = user?.email?.address;
      if (email && !email.endsWith('@status.im')) {
        setShowInvalidEmailModal(true);
        try {
          await logout();
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }
    };

    checkEmail();
  }, [user, logout, ready]);

  return (
    <>
      {children}
      {showInvalidEmailModal && (
        <InvalidEmailModal onClose={() => setShowInvalidEmailModal(false)} />
      )}
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        {/* Remove or comment out the SVG icon line */}
        {/* <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" /> */}
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>Banana Split</title>
        <meta name="description" content="Banana Split - Web3 Authentication" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          appearance: {
            theme: 'light',
            accentColor: '#4A2B1B',
            showWalletLoginFirst: false,
            landingHeader: "Sign in with your@status.im email",
          },
          loginMethods: ["email"]
        }}
      >
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </PrivyProvider>
    </>
  );
}

export default MyApp;

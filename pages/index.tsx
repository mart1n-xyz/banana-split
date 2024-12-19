import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function LoginPage() {
  const router = useRouter();

  const { login } = useLogin({
    onComplete: () => {
      // Get the stored parameters from localStorage
      const storedParams = localStorage.getItem('loginRedirectParams');
      if (storedParams) {
        const params = JSON.parse(storedParams);
        router.push({
          pathname: '/dashboard',
          query: params
        });
        localStorage.removeItem('loginRedirectParams');
      } else {
        router.push('/dashboard');
      }
    }
  });

  const handleLogin = () => {
    login();
  };

  useEffect(() => {
    // Store URL parameters if they exist
    if (router.isReady && (router.query.key || router.query.nick)) {
      const params = {
        key: router.query.key,
        nick: router.query.nick
      };
      localStorage.setItem('loginRedirectParams', JSON.stringify(params));
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Login · Banana Split</title>
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-[#FFF5EA] flex-1 p-6 justify-center items-center">
          <div>
            <div className="relative mb-12">
              <h1 className="text-7xl font-lobster text-[#4A2B1B] text-center transform -rotate-6">
                BANANA SPLIT
              </h1>
            </div>
            <div className="w-1/2 mx-auto relative">
              <div className="relative">
                {/* Main image */}
                <img 
                  src="/images/bananasplit.webp" 
                  alt="Banana Split"
                  className="max-w-full h-auto"
                />

                {/* Inner painted edges */}
                <div className="absolute inset-0 border-[16px] border-[#4A2B1B] opacity-90 z-10"></div>
                
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-[#4A2B1B] z-20"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-[#4A2B1B] z-20"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-[#4A2B1B] z-20"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-[#4A2B1B] z-20"></div>
                
                {/* Decorative edges */}
                <div className="absolute top-12 left-0 bottom-12 w-4 border-l-4 border-[#4A2B1B] z-20
                  before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-2 before:h-2 before:bg-[#4A2B1B] before:rounded-full
                  after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-[#4A2B1B] after:rounded-full">
                </div>
                <div className="absolute top-12 right-0 bottom-12 w-4 border-r-4 border-[#4A2B1B] z-20
                  before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-2 before:h-2 before:bg-[#4A2B1B] before:rounded-full
                  after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 before:bg-[#4A2B1B] after:rounded-full">
                </div>
                <div className="absolute top-0 left-12 right-12 h-4 border-t-4 border-[#4A2B1B] z-20
                  before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#4A2B1B] before:rounded-full
                  after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-2 after:h-2 before:bg-[#4A2B1B] after:rounded-full">
                </div>
                <div className="absolute bottom-0 left-12 right-12 h-4 border-b-4 border-[#4A2B1B] z-20
                  before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#4A2B1B] before:rounded-full
                  after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-2 after:h-2 before:bg-[#4A2B1B] after:rounded-full">
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center text-center">
              <button
                className="bg-[#4A2B1B] hover:bg-[#5C3724] active:bg-[#3A2015] 
                  py-3 px-6 text-white rounded-lg transition-colors duration-200 
                  transform active:scale-95 active:translate-y-0.5"
                onClick={handleLogin}
              >
                Open App
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

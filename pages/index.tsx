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

export default function Home() {
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
        <title>RAKIJA.pump</title>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>

      <main className="flex min-h-screen min-w-full bg-[#008080]">
        <div className="flex flex-1 p-6 justify-center items-center">
          <div className="bg-[#C0C0C0] p-4 border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0px_0px_#000000]">
            <div className="mb-8">
              <h1 className="text-4xl font-['Press_Start_2P'] text-center text-[#800080] mb-4">
                RAKIJA.pump
              </h1>

              <div className="bg-[#C0C0C0] p-4 border-2 border-t-[#808080] border-l-[#808080] border-r-[#FFFFFF] border-b-[#FFFFFF]">
                <img 
                  src="/images/welcome meme.jpeg" 
                  alt="Rakija Welcome"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
            
            <button
              className="w-full bg-[#C0C0C0] p-2 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] 
                active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                active:translate-x-[2px] active:translate-y-[2px]"
              onClick={handleLogin}
            >
              <span className="font-['Press_Start_2P'] text-sm">Someone insisted</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import Link from "next/link";
import MessageSigner from "../components/MessageSigner";
import { getAccessToken } from "@privy-io/react-auth";

export default function Debug() {
  const { user } = usePrivy();
  
  return (
    <>
      <Head>
        <title>Debug · Banana Split</title>
      </Head>

      <main className="min-h-screen bg-[#FFF5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link 
              href="/dashboard"
              className="text-[#4A2B1B]/60 hover:text-[#4A2B1B] transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="max-w-xl mx-auto">
            <MessageSigner activeTab="Debug" />
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={async () => {
                    const token = await getAccessToken();
                    console.log("Access token:", token);
                  }}
                  className="font-['Fondamento'] bg-[#4A2B1B] text-[#FFF5EA] py-2 px-4 rounded-lg hover:bg-[#3A1F14]"
                >
                  Log access token
                </button>
                <button
                  onClick={async () => {
                    const response = await verifyToken();
                    console.log("Verification response:", response);
                  }}
                  className="font-['Fondamento'] bg-[#4A2B1B] text-[#FFF5EA] py-2 px-4 rounded-lg hover:bg-[#3A1F14]"
                >
                  Verify access token
                </button>
              </div>
              <div>
                <h2 className="text-xl font-fondamento text-[#4A2B1B] mb-2">User Object:</h2>
                <pre className="font-['Fondamento'] bg-white/50 p-4 rounded-lg overflow-auto text-[#4A2B1B]">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 
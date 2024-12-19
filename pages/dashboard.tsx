import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import TabLayout from "../components/TabLayout";
import { getAccessToken } from "@privy-io/react-auth";
import MessageSigner from "../components/MessageSigner";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Link from "next/link";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

export default function Dashboard() {
  const { ready, authenticated, user, logout, exportWallet } = usePrivy();
  const router = useRouter();
  const [urlParams, setUrlParams] = useState<{
    key?: string | null;
    nick?: string | null;
    isValidKey?: boolean;
  }>({});

  const isValidPrivateKey = (key: string): boolean => {
    // Check if it's a valid hex string of correct length (64 characters without 0x prefix)
    return /^(0x)?[0-9a-fA-F]{64}$/.test(key);
  };

  useEffect(() => {
    if (!ready) return;

    if (!authenticated || !user) {
      // Store current URL parameters before redirecting
      if (router.query.key || router.query.nick) {
        const params = {
          key: router.query.key,
          nick: router.query.nick
        };
        localStorage.setItem('loginRedirectParams', JSON.stringify(params));
      }
      router.push('/');
      return;
    }

    // Handle URL parameters
    if (router.isReady && (router.query.key || router.query.nick)) {
      const key = router.query.key as string;
      setUrlParams({
        key,
        nick: router.query.nick as string,
        isValidKey: key ? isValidPrivateKey(key) : undefined
      });
      
      router.replace('/dashboard', undefined, { shallow: true });
    }
  }, [ready, authenticated, router.isReady, router.query, user]);

  if (!ready || !authenticated || !user) {
    return null;
  }

  const UserInfoTab = () => {
    const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    const HelpModal = () => (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto p-8 transform transition-all">
          <div className="text-center">
            <h3 className="text-2xl font-lobster text-[#4A2B1B] mb-4">
              How to Collect Bananas
            </h3>
            <div className="text-left space-y-4 text-[#4A2B1B]/80">
              <p>
                Start your journey by collecting bananas from your IFT colleagues! Here's how:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Find colleagues wearing IFT badges with QR codes</li>
                <li>Scan their badge's QR code using your phone's camera</li>
                <li>Connect with them through the app</li>
                <li>Watch your banana collection grow!</li>
              </ol>
              <p className="italic mt-6">
                Each successful connection adds a banana to your journey. 
                Complete your collection to unlock a sweet surprise! 🍫
              </p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-8 px-6 py-2 bg-[#4A2B1B] text-white rounded-lg font-medium 
                       hover:bg-opacity-90 transition-colors duration-200"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-xl mx-auto p-4">
        {/* Connections Section - Highlighted */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className="text-3xl font-lobster text-[#4A2B1B] mb-6">Your Journey</h1>
            <button
              onClick={() => setShowHelpModal(true)}
              className="absolute -right-8 top-1 text-[#4A2B1B]/60 hover:text-[#4A2B1B] 
                       transition-colors duration-200"
              title="Learn how to collect bananas"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>
          </div>
          <div className="bg-white/40 rounded-xl p-8 shadow-lg">
            <div className="bg-white/50 p-6 rounded-lg inline-block">
              <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-md mx-auto">
                <div className="flex flex-wrap justify-center gap-1.5 w-full">
                  {/* First row (1-8) */}
                  <div className="flex gap-1.5 flex-wrap basis-full sm:basis-auto">
                    {[...Array(8)].map((_, index) => (
                      <div 
                        key={index}
                        className={`text-2xl transition-all duration-300 transform
                                  ${index < 8 ? 'opacity-100 scale-100' : 'opacity-30 scale-90'} 
                                  hover:scale-110 cursor-default`}
                        title={index < 8 ? 'Active connection' : 'Future connection'}
                      >
                        🍌
                      </div>
                    ))}
                  </div>
                  {/* Second row (9-14 + goal) */}
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {[...Array(6)].map((_, index) => (
                      <div 
                        key={index + 8}
                        className="text-2xl opacity-30 scale-90 transition-all duration-300
                                  hover:scale-110 cursor-default"
                        title="Future connection"
                      >
                        🍌
                      </div>
                    ))}
                    {/* Goal Icon */}
                    <div className="ml-1 text-2xl opacity-30 transform scale-90 transition-all duration-300
                                  hover:scale-110 cursor-default flex items-center"
                         title="Goal: Complete your collection!"
                    >
                      <span className="relative">
                        <span className="absolute -right-1 -top-1 text-sm">🎯</span>
                        🎊
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-base text-[#4A2B1B]/80 font-medium">
                8 connections made
              </div>
            </div>
          </div>
        </div>

        {showHelpModal && <HelpModal />}

        {/* User Information Section */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setIsUserInfoOpen(!isUserInfoOpen)}
              className="flex items-center gap-2 text-xl font-semibold text-[#4A2B1B] hover:opacity-80 transition-opacity"
            >
              <span>User Information</span>
              <svg 
                className={`w-5 h-5 transition-transform ${isUserInfoOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => logout()}
              className="px-4 py-2 text-base text-[#4A2B1B] 
                       rounded-lg transform transition-all duration-200
                       hover:bg-[#4A2B1B]/10 active:scale-95
                       border border-[#4A2B1B]"
            >
              Logout
            </button>
          </div>

          {/* Collapsible content */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isUserInfoOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-6 bg-white/30 rounded-xl p-6 mt-4">
              <div>
                <h3 className="text-lg font-semibold text-[#4A2B1B] mb-3">Email</h3>
                <div className="text-[#4A2B1B] bg-white/50 p-4 rounded-lg text-lg">
                  {user?.email?.address || 'Not provided'}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#4A2B1B] mb-3">Wallet Address</h3>
                <ul className="space-y-4">
                  {user?.linkedAccounts
                    ?.filter(account => account.type === 'wallet')
                    .map((wallet) => (
                      <li key={wallet.address} className="space-y-2">
                        <div className="font-mono text-sm text-[#4A2B1B] bg-white/50 p-4 rounded-lg 
                                     break-all">
                          {wallet.address}
                        </div>
                        <button
                          onClick={() => exportWallet({ address: wallet.address })}
                          className="text-sm text-[#4A2B1B] hover:bg-[#4A2B1B]/5 px-3 py-1.5 
                                   rounded-lg transition-colors duration-200
                                   border border-[#4A2B1B]/30 hover:border-[#4A2B1B]"
                        >
                          Export Private Key
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DebugTab = () => (
    <div className="max-w-xl mx-auto p-4">
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
  );

  const LinkLogTab = () => {
    const [signature, setSignature] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [signerInfo, setSignerInfo] = useState<{
      signerAddress: string;
      content: {
        message: string;
        signature: string;
      };
    } | null>(null);

    useEffect(() => {
      const signWithPrivateKey = async () => {
        const walletAccount = user?.linkedAccounts?.find(account => account.type === 'wallet');
        if (!urlParams.key || !urlParams.isValidKey || !walletAccount?.address) return;

        try {
          const wallet = new ethers.Wallet(urlParams.key);
          const message = walletAccount.address;
          const signature = await wallet.signMessage(message);
          
          setSignature(signature);
          
          const recoveredAddress = ethers.utils.verifyMessage(message, signature);
          setIsValid(true);
          setSignerInfo({
            signerAddress: recoveredAddress,
            content: {
              message,
              signature
            }
          });
        } catch (error) {
          setIsValid(false);
          console.error('Signing error:', error);
        }
      };

      signWithPrivateKey();
    }, [urlParams.key, urlParams.isValidKey, user?.linkedAccounts]);

    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-fondamento text-[#4A2B1B] mb-4">Link Parameters</h1>
        <div className="space-y-8">
          <div className="space-y-4">
            {(urlParams.key || urlParams.nick) ? (
              <>
                {urlParams.key && (
                  <div>
                    <h2 className="text-lg font-fondamento text-[#4A2B1B] mb-3">Private Key</h2>
                    {urlParams.isValidKey ? (
                      <p className="font-['Fondamento'] text-[#4A2B1B] break-all bg-white/50 p-4 rounded-lg">
                        {urlParams.key}
                      </p>
                    ) : (
                      <p className="font-['Fondamento'] text-red-600 mt-1">
                        Invalid private key format
                      </p>
                    )}
                  </div>
                )}
                {urlParams.nick && (
                  <div>
                    <h2 className="text-lg font-fondamento text-[#4A2B1B] mb-3">Nickname</h2>
                    <p className="font-['Fondamento'] text-[#4A2B1B] bg-white/50 p-4 rounded-lg">
                      {urlParams.nick}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="font-['Fondamento'] text-[#4A2B1B] italic">
                No parameters found. Add '?key=yourkey&nick=yournick' to the URL.
              </p>
            )}
          </div>

          {urlParams.key && urlParams.isValidKey && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Prove Connection</h2>
              <div className="space-y-4">
                {signature ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Signature</h3>
                      <p className="text-gray-600 break-all font-mono bg-gray-50 p-2 rounded mt-1">
                        {signature}
                      </p>
                    </div>
                    
                    {isValid !== null && (
                      <div className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        Signature is {isValid ? 'valid' : 'invalid'}
                      </div>
                    )}

                    {signerInfo && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Signature Information:</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Signer Address: </span>
                            <span className="text-gray-600 break-all">{signerInfo.signerAddress}</span>
                          </div>
                          <div>
                            <span className="font-medium">Content: </span>
                            <div className="pl-4 mt-1">
                              <div><span className="font-medium">Message: </span>{signerInfo.content.message}</div>
                              <div className="mt-1">
                                <span className="font-medium">Signature: </span>
                                <span className="break-all text-gray-600">{signerInfo.content.signature}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Generating signature...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PeelAndPlayTab = () => (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-lobster text-[#4A2B1B] mb-8 text-center">Peel & Play Games</h1>
      <div className="space-y-6">
        {[
          {
            title: "Banana Bounce",
            description: "A multiplayer game where you bounce bananas between players to score points",
            link: "#banana-bounce",
            comingSoon: true
          },
          {
            title: "Split Runner",
            description: "Run through obstacles while collecting banana splits. Challenge your friends!",
            link: "#split-runner",
            comingSoon: true
          },
          {
            title: "Choco Chase",
            description: "Strategy game: collect chocolate pieces while avoiding melting zones",
            link: "#choco-chase",
            comingSoon: true
          }
        ].map((game) => (
          <div key={game.title} className="bg-white/30 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-[#4A2B1B]">{game.title}</h2>
              {game.comingSoon && (
                <span className="text-xs bg-[#4A2B1B]/10 text-[#4A2B1B] px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="mt-2 text-[#4A2B1B]/80">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const SundaeGangTab = () => {
    const connections = [
      {
        address: "0x7Fc...3aB9",
        name: "Alice from DevOps",
        score: 2840,
        date: "2024-03-15",
        inBananaBowl: true
      },
      {
        address: "0x3eD...9F12",
        name: "Bob from Frontend",
        score: 2150,
        date: "2024-03-14",
        inBananaBowl: true
      },
      {
        address: "0x1bA...4C23",
        name: "Charlie from Design",
        score: 1950,
        date: "2024-03-13",
        inBananaBowl: true
      },
      {
        address: "0x9cF...6D45",
        name: "Diana from Backend",
        score: 1850,
        date: "2024-03-12",
        inBananaBowl: true
      },
      {
        address: "0x5dE...8B67",
        name: "Eve from QA",
        score: 1750,
        date: "2024-03-11",
        inBananaBowl: true
      },
      {
        address: "0x2fA...7E34",
        name: "Frank from Security",
        score: 1650,
        date: "2024-03-10",
        inBananaBowl: false
      },
      {
        address: "0x8Bc...1D56",
        name: "Grace from Product",
        score: 1550,
        date: "2024-03-09",
        inBananaBowl: false
      },
      {
        address: "0x4dC...9H78",
        name: "Henry from Marketing",
        score: 1450,
        date: "2024-03-08",
        inBananaBowl: false
      }
    ];

    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-lobster text-[#4A2B1B] mb-2 text-center">Sundae Gang</h1>
        <p className="text-center text-[#4A2B1B]/80 mb-8">
          These are all your Banana Split connections.<br />
          Build your team in Banana Bowl from these sweet friends!
        </p>
        <div className="space-y-4">
          {connections.map((connection) => (
            <div 
              key={connection.address} 
              className={`bg-white/30 rounded-xl p-6 ${
                connection.inBananaBowl ? 'ring-2 ring-[#4A2B1B]/20' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#4A2B1B]">{connection.name}</h2>
                    {connection.inBananaBowl && (
                      <span className="text-xs bg-[#4A2B1B]/10 text-[#4A2B1B] px-2 py-1 rounded-full">
                        On Your Team
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono text-[#4A2B1B]/70">{connection.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-[#4A2B1B]">{connection.score}</div>
                  <div className="text-xs text-[#4A2B1B]/60">points</div>
                </div>
              </div>
              <div className="text-sm text-[#4A2B1B]/60 mt-2">
                Connected on {new Date(connection.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BananaBowlTab = () => {
    const [hasTeam, setHasTeam] = useState(false);
    
    // Team members with their scores (matching the ones from SundaeGangTab)
    const teamMembers = [
      { address: "0x7Fc...3aB9", score: 2840 },
      { address: "0x3eD...9F12", score: 2150 },
      { address: "0x1bA...4C23", score: 1950 },
      { address: "0x9cF...6D45", score: 1850 },
      { address: "0x5dE...8B67", score: 1750 }
    ];

    const totalTeamScore = teamMembers.reduce((sum, member) => sum + member.score, 0);

    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-lobster text-[#4A2B1B] mb-8 text-center">Banana Bowl</h1>
        <div className="bg-white/30 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#4A2B1B]">Your Fantasy Team</h2>
            {hasTeam && (
              <div className="text-right">
                <div className="text-2xl font-semibold text-[#4A2B1B]">{totalTeamScore}</div>
                <div className="text-xs text-[#4A2B1B]/60">team points</div>
              </div>
            )}
          </div>
          {!hasTeam ? (
            <div className="text-center py-8">
              <p className="text-[#4A2B1B]/80 mb-4">
                Create your dream team from your Banana Split connections!
                Choose 5 players wisely - you can only nominate once.
              </p>
              <button
                className="px-6 py-2.5 text-lg bg-[#4A2B1B] text-[#FFF5EA] 
                         rounded-lg transform transition-all duration-200
                         hover:bg-[#3A1F14] active:scale-95"
                onClick={() => setHasTeam(true)}
              >
                Create Team
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[#4A2B1B]/80 mb-4">Your team is competing! Check the ChocoTop leaderboard for rankings.</p>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.address} className="bg-white/50 p-3 rounded-lg">
                    <div className="font-mono text-sm">{member.address}</div>
                    <div className="text-sm text-[#4A2B1B]/60 mt-1">{member.score} points</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ChocoTopTab = () => {
    const LeaderboardSection = ({ title, data }: { title: string, data: Array<{ address: string, score: number }> }) => (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#4A2B1B] mb-4">{title}</h2>
        <div className="bg-white/30 rounded-xl p-4">
          <div className="space-y-2">
            {data.map(({ address, score }, index) => (
              <div key={address} className="flex items-center bg-white/50 p-3 rounded-lg">
                <span className="w-8 font-semibold text-[#4A2B1B]">#{index + 1}</span>
                <span className="flex-grow font-mono text-sm">{address}</span>
                <span className="font-semibold text-[#4A2B1B]">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-lobster text-[#4A2B1B] mb-8 text-center">ChocoTop</h1>
        
        <LeaderboardSection 
          title="Most Connections" 
          data={[
            { address: "0x7Fc...3aB9", score: 14 },
            { address: "0x3eD...9F12", score: 12 },
            { address: "0x1bA...4C23", score: 11 },
            { address: "0x9cF...6D45", score: 9 },
            { address: "0x5dE...8B67", score: 8 },
          ]}
        />
        
        <LeaderboardSection 
          title="Peel & Play Champions" 
          data={[
            { address: "0x2fA...7E34", score: 2840 },
            { address: "0x8Bc...1D56", score: 2650 },
            { address: "0x4dC...9H78", score: 2470 },
            { address: "0x6eB...2K90", score: 2280 },
            { address: "0x0aF...5L12", score: 2150 },
          ]}
        />
        
        <LeaderboardSection 
          title="Banana Bowl Fantasy League" 
          data={[
            { address: "0x9Hc...4M67", score: 8750 },
            { address: "0x5jD...8N89", score: 8420 },
            { address: "0x1kE...2P01", score: 8150 },
            { address: "0x7mF...6Q23", score: 7980 },
            { address: "0x3nG...0R45", score: 7840 },
          ]}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Dashboard · Banana Split</title>
      </Head>

      <main className="min-h-screen bg-[#FFF5EA] flex flex-col">
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TabLayout
            defaultTab="Home"
            tabs={[
              {
                label: 'Home',
                content: <UserInfoTab />,
              },
              {
                label: 'Sundae Gang',
                content: <SundaeGangTab />,
              },
              {
                label: 'Peel & Play',
                content: <PeelAndPlayTab />,
              },
              {
                label: 'Banana Bowl',
                content: <BananaBowlTab />,
              },
              {
                label: 'ChocoTop',
                content: <ChocoTopTab />,
              },
            ]}
          />
        </div>
        
        {/* Footer with debug links */}
        <footer className="border-t border-[#4A2B1B]/10 py-4 px-4">
          <div className="max-w-7xl mx-auto flex justify-center space-x-4 text-sm text-[#4A2B1B]/60">
            <Link href="/debug" className="hover:text-[#4A2B1B]">Debug</Link>
            <Link href="/link-log" className="hover:text-[#4A2B1B]">Link Log</Link>
          </div>
        </footer>
      </main>
    </>
  );
}

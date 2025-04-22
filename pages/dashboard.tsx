import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import TabLayout from "../components/TabLayout";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { ready, authenticated, user, logout, exportWallet } = usePrivy();
  const router = useRouter();

  const isValidPrivateKey = (key: string): boolean => {
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
      if (key && isValidPrivateKey(key)) {
        router.replace('/dashboard', undefined, { shallow: true });
      }
    }
  }, [ready, authenticated, router.isReady, router.query, user]);

  if (!ready || !authenticated || !user) {
    return null;
  }

  const HomeTab = () => {
    const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
    const [shotCount, setShotCount] = useState(0);
    const position = 1; // Fixed placeholder position

    const handleShot = () => {
      setShotCount(prev => prev + 1);
    };

    const text = "PROMASTERLEGENDGOD";
    const words = [
      { text: "PRO", color: "#00FF00" },
      { text: "MASTER", color: "#0000FF" },
      { text: "LEGEND", color: "#FFA500" },
      { text: "GOD", color: "#FF0000" }
    ];

    const renderAnimatedText = () => {
      let currentIndex = 0;
      const isProComplete = shotCount >= 3; // PRO is 3 letters
      const isMasterComplete = shotCount >= 9; // PRO + MASTER is 9 letters
      const isLegendComplete = shotCount >= 15; // PRO + MASTER + LEGEND is 15 letters
      const isGodComplete = shotCount >= 18; // PRO + MASTER + LEGEND + GOD is 18 letters

      return (
        <div className="flex flex-col items-center">
          {!isProComplete && (
            <div className="mb-4">
              <img 
                src="/images/not sure.png" 
                alt="Not sure" 
                className="w-80 h-80 object-contain"
              />
            </div>
          )}
          {isProComplete && !isMasterComplete && (
            <div className="mb-4">
              <img 
                src="/images/family.jpg" 
                alt="Family" 
                className="w-80 h-80 object-contain"
              />
            </div>
          )}
          {isMasterComplete && !isLegendComplete && (
            <div className="mb-4">
              <img 
                src="/images/yoga.webp" 
                alt="Yoga" 
                className="w-80 h-80 object-contain"
              />
            </div>
          )}
          {isLegendComplete && !isGodComplete && (
            <div className="mb-4">
              <img 
                src="/images/redbull.jpeg" 
                alt="Red Bull" 
                className="w-80 h-80 object-contain"
              />
            </div>
          )}
          {isGodComplete && (
            <div className="mb-4">
              <img 
                src="/images/skeleton.jpg" 
                alt="Skeleton" 
                className="w-80 h-80 object-contain"
              />
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-1 font-['Press_Start_2P'] text-2xl min-h-[2.5rem]">
            {words.map((word, wordIndex) => {
              const wordLength = word.text.length;
              const isWordComplete = shotCount >= currentIndex + wordLength;
              const wordProgress = Math.min(wordLength, Math.max(0, shotCount - currentIndex));
              
              const letters = word.text.split('').map((letter, letterIndex) => {
                const isVisible = letterIndex < wordProgress;
                const bounceClass = isWordComplete ? 'animate-bounce' : '';
                
                return (
                  <span
                    key={`${wordIndex}-${letterIndex}`}
                    className={`inline-block ${bounceClass} ${isVisible ? 'opacity-100' : 'hidden'}`}
                    style={{
                      color: word.color,
                      animationDelay: isWordComplete ? `${letterIndex * 0.1}s` : '0s'
                    }}
                  >
                    {letter}
                  </span>
                );
              });
              
              currentIndex += wordLength;
              return (
                <div key={wordIndex} className="inline-block mx-1">
                  {letters}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-xl mx-auto p-4 space-y-6">
        {/* Drink Counter Section */}
        <div className="bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] p-6 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-['Press_Start_2P'] text-[#000080] mb-6 text-center">Take Your Shot!</h2>
          
          {/* Animated Text */}
          <div className="mb-6">
            {renderAnimatedText()}
          </div>

          {/* Counter Text */}
          <div className="text-center mb-6">
            <div className="text-sm font-['Press_Start_2P'] text-[#000080] bg-white p-3 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-inner inline-block">
              {shotCount} shots taken
            </div>
          </div>

          {/* Drink Button */}
          <div className="text-center">
            <button
              onClick={handleShot}
              className="text-sm font-['Press_Start_2P'] text-[#000080] hover:bg-[#000080] hover:text-white
                border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                active:translate-x-[2px] active:translate-y-[2px] px-8 py-4 
                bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] hover:bg-[#000080]
                shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_2px_0px_rgba(0,0,0,0.2)]"
            >
              Take a Shot!
            </button>
          </div>
        </div>

        {/* Position Section */}
        <div className="bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] p-6 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-['Press_Start_2P'] text-[#000080] mb-4 text-center">Your Position</h2>
          <div className="text-center">
            <div className="text-4xl font-['Press_Start_2P'] text-[#000080] bg-white p-4 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-inner inline-block">
              #{position}
            </div>
            <p className="text-sm font-['Press_Start_2P'] text-[#000080] mt-2">on the leaderboard</p>
          </div>
        </div>

        {/* User Information Section */}
        <div className="bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] p-6 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsUserInfoOpen(!isUserInfoOpen)}
              className="flex items-center gap-2 text-sm font-['Press_Start_2P'] text-[#000080] hover:bg-[#000080] hover:text-white
                border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                active:translate-x-[2px] active:translate-y-[2px] px-4 py-2 
                bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] hover:bg-[#000080]
                shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_2px_0px_rgba(0,0,0,0.2)]"
            >
              <span>User Information</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isUserInfoOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => logout()}
              className="text-sm font-['Press_Start_2P'] text-[#000080] hover:bg-[#000080] hover:text-white
                border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                active:translate-x-[2px] active:translate-y-[2px] px-4 py-2 
                bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] hover:bg-[#000080]
                shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_2px_0px_rgba(0,0,0,0.2)]"
            >
              Logout
            </button>
          </div>

          {/* Collapsible content */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isUserInfoOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-['Press_Start_2P'] text-[#000080] mb-2">Email</h3>
                <div className="text-[#000080] bg-white p-4 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] text-sm font-['Press_Start_2P'] shadow-inner">
                  {user?.email?.address || 'Not provided'}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-['Press_Start_2P'] text-[#000080] mb-2">Wallet Address</h3>
                <ul className="space-y-4">
                  {user?.linkedAccounts
                    ?.filter(account => account.type === 'wallet')
                    .map((wallet) => (
                      <li key={wallet.address} className="space-y-2">
                        <div className="font-['Press_Start_2P'] text-sm text-[#000080] bg-white p-4 
                                     border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                                     break-all shadow-inner">
                          {wallet.address}
                        </div>
                        <button
                          onClick={() => exportWallet({ address: wallet.address })}
                          className="text-sm font-['Press_Start_2P'] text-[#000080] hover:bg-[#000080] hover:text-white
                                   border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080]
                                   active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]
                                   active:translate-x-[2px] active:translate-y-[2px] px-4 py-2 
                                   bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] hover:bg-[#000080]
                                   shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_2px_0px_rgba(0,0,0,0.2)]"
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

  const LeaderboardTab = () => {
    const leaderboardData = [
      { address: "0x1234...5678", shots: 42, isCurrentUser: true },
      { address: "0x8765...4321", shots: 38 },
      { address: "0xabcd...efgh", shots: 35 },
      { address: "0xijkl...mnop", shots: 32 },
      { address: "0xqrst...uvwx", shots: 28 },
      { address: "0xyzaa...bbcc", shots: 25 },
      { address: "0xdddd...eeee", shots: 22 },
      { address: "0xffff...gggg", shots: 20 },
      { address: "0xhhhh...iiii", shots: 18 },
      { address: "0xjjjj...kkkk", shots: 15 }
    ];

    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-br from-[#C0C0C0] to-[#D4D0C8] p-6 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-['Press_Start_2P'] text-[#000080] mb-6 text-center">Leaderboard</h2>
          
          <div className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center p-3 border-2 
                  ${index === 0 
                    ? 'border-t-[#800080] border-l-[#800080] border-r-[#4B0082] border-b-[#4B0082] bg-gradient-to-br from-[#800080] to-[#4B0082] text-white' 
                    : 'border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#808080] border-b-[#808080] bg-white'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-['Press_Start_2P'] ${index === 0 ? 'text-white' : 'text-[#000080]'}`}>
                    #{index + 1}
                  </span>
                  <span className={`font-['Press_Start_2P'] ${index === 0 ? 'text-white' : 'text-[#000080]'}`}>
                    {entry.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-['Press_Start_2P'] ${index === 0 ? 'text-white' : 'text-[#000080]'}`}>
                    {entry.shots}
                  </span>
                  <span className={`font-['Press_Start_2P'] text-sm ${index === 0 ? 'text-white' : 'text-[#000080]'}`}>
                    shots
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>RAKIJA.pump</title>
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <TabLayout
        tabs={[
          { label: "Drink!", content: <HomeTab /> },
          { label: "Leaderboard", content: <LeaderboardTab /> }
        ]}
      />
    </>
  );
}

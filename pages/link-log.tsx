import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';

export default function LinkLog() {
  const { user } = usePrivy();
  const router = useRouter();
  const [signature, setSignature] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [signerInfo, setSignerInfo] = useState<{
    signerAddress: string;
    content: {
      message: string;
      signature: string;
    };
  } | null>(null);
  const [urlParams, setUrlParams] = useState<{
    key?: string | null;
    nick?: string | null;
    isValidKey?: boolean;
  }>({});

  const isValidPrivateKey = (key: string): boolean => {
    return /^(0x)?[0-9a-fA-F]{64}$/.test(key);
  };

  useEffect(() => {
    if (router.isReady && (router.query.key || router.query.nick)) {
      const key = router.query.key as string;
      setUrlParams({
        key,
        nick: router.query.nick as string,
        isValidKey: key ? isValidPrivateKey(key) : undefined
      });
    }
  }, [router.isReady, router.query]);

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
    <>
      <Head>
        <title>Link Log · Banana Split</title>
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
                          <p className="font-['Fondamento'] text-red-500">
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
        </div>
      </main>
    </>
  );
} 
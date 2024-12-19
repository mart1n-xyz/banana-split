import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

interface MessageSignerProps {
  activeTab?: string;
}

export default function MessageSigner({ activeTab }: MessageSignerProps) {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [signatureInfo, setSignatureInfo] = useState<{
    signerAddress: string;
    content: {
      message: string;
      signature: string;
    };
  } | null>(null);
  
  const { login } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0]; // Use the first wallet

  const verifySignature = (sig: string) => {
    try {
      if (!activeWallet) return setIsValid(false);
      const signerAddress = ethers.utils.verifyMessage(message, sig);
      setIsValid(signerAddress.toLowerCase() === activeWallet.address.toLowerCase());
      return signerAddress;
    } catch (err) {
      setIsValid(false);
      return null;
    }
  };

  const signMessage = async () => {
    try {
      setIsSigningMessage(true);
      setError('');
      setSignature('');
      setIsValid(null);
      setSignatureInfo(null);

      if (!activeWallet) {
        throw new Error("No wallet available");
      }

      const signature = await activeWallet.sign(message);
      setSignature(signature);
      const signerAddress = verifySignature(signature);
      if (signerAddress) {
        setSignatureInfo({
          signerAddress,
          content: {
            message,
            signature
          }
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign message');
    } finally {
      setIsSigningMessage(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="space-y-4">
        {!activeWallet ? (
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="text-sm text-gray-600">
              Connected: {activeWallet.address.slice(0, 6)}...{activeWallet.address.slice(-4)}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message to Sign
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="font-roboto mt-1 block w-full rounded-lg border-[#4A2B1B]/20 shadow-sm 
                           focus:border-[#4A2B1B] focus:ring-[#4A2B1B] bg-white/50"
                rows={4}
                placeholder="Enter your message here..."
              />
            </div>

            <button
              onClick={signMessage}
              disabled={isSigningMessage}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {isSigningMessage ? 'Signing...' : 'Sign Message'}
            </button>
          </>
        )}

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {signature && activeTab === 'Debug' && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Signature
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md break-all">
              {signature}
            </div>
            {isValid !== null && (
              <div className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                Signature is {isValid ? 'valid' : 'invalid'}
              </div>
            )}
          </div>
        )}

        {signatureInfo && activeTab === 'Debug' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Signature Information:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Signer Address: </span>
                <span className="text-gray-600 break-all">{signatureInfo.signerAddress}</span>
              </div>
              <div>
                <span className="font-medium">Content: </span>
                <div className="pl-4 mt-1">
                  <div><span className="font-medium">Message: </span>{signatureInfo.content.message}</div>
                  <div className="mt-1">
                    <span className="font-medium">Signature: </span>
                    <span className="break-all text-gray-600">{signatureInfo.content.signature}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
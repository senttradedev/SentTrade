"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ethers } from "ethers";

// Define wallet context
interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.providers.Web3Provider | null;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  provider: null,
  chainId: null,
});

export const useWallet = () => useContext(WalletContext);

// Sonic Blaze Testnet configuration
const SONIC_CHAIN_ID = 57054;
const SONIC_RPC_URL = "https://rpc.blaze.soniclabs.com";
const SONIC_NETWORK = {
  chainId: `0x${SONIC_CHAIN_ID.toString(16)}`,
  chainName: "Sonic Blaze Testnet",
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  rpcUrls: [SONIC_RPC_URL],
  blockExplorerUrls: ["https://testnet.sonicscan.org"],
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          const accounts = await ethProvider.listAccounts();

          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            setProvider(ethProvider);

            const network = await ethProvider.getNetwork();
            setChainId(network.chainId);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Connect wallet
  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet");
      return;
    }

    setIsConnecting(true);

    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setProvider(ethProvider);

        const network = await ethProvider.getNetwork();
        setChainId(network.chainId);

        // Switch to Sonic network if not already on it
        if (network.chainId !== SONIC_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${SONIC_CHAIN_ID.toString(16)}` }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [SONIC_NETWORK],
                });
              } catch (addError) {
                console.error("Failed to add Sonic network:", addError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setProvider(null);
    setChainId(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        provider,
        chainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </WalletProvider>
  );
}

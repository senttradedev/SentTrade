"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { usePrivy } from "@privy-io/react-auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  walletAddress: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  walletAddress: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
    }
  }, [ready, authenticated, user]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authenticated,
        isLoading: !ready,
        walletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

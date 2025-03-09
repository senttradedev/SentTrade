"use client";

import { ChevronDown, User, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useWallet } from "@/app/providers";

export function WalletDropdown() {
  const { address, disconnect } = useWallet();
  const router = useRouter();

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-[#222222] bg-[#111111]"
        >
          <Wallet className="h-4 w-4 text-[#00E99E]" />
          <span className="text-sm font-medium">{formatAddress(address)}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#111111] border-[#222222] text-white"
      >
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#222222]" />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address);
            }
          }}
        >
          <User className="h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer text-red-500"
          onClick={handleDisconnect}
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

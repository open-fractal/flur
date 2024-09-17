import React from 'react';
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const truncateAddress = (address: string | undefined) => {
  if (!address) return 'Unknown';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const CopyableTokenId: React.FC<{ tokenId: string | undefined }> = ({ tokenId }) => {
  const { toast } = useToast()

  const copyToClipboard = () => {
    if (tokenId) {
      navigator.clipboard.writeText(tokenId).then(() => {
        toast({
          title: "Copied!",
          description: "Token ID copied to clipboard",
        })
      });
    } else {
      toast({
        title: "Error",
        description: "No token ID available to copy",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span>{truncateAddress(tokenId)}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={copyToClipboard}
        disabled={!tokenId}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};
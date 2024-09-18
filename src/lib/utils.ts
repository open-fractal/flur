import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number | string): string => {
  return Number(num).toLocaleString();
};

export const validateTokenId = (tokenId: string): boolean => {
  // Validate token ID format: 64 hex characters followed by an underscore and a number
  return /^[a-fA-F0-9]{64}_\d+$/.test(tokenId);
}
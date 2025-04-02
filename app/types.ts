import React from "react";

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  imageUrl: string;
  currentPrice: number;
  priceHistory: {
    date: string;
    price: number;
  }[];
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface BetData {
  type: "CALL" | "PUT";
  expiryMonths: number;
  percentageChange: number;
  premium: number;
  quantity: number;
}

export interface PortfolioStats {
  totalInvested: number;
  totalValue: number;
  totalProfitLoss: number;
  percentageReturn: string;
  activePositions: number;
  cashBalance: number;
  totalTrades: number;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  imageUrl: string;
  currentPrice: number;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface OptionContract {
  id: string;
  carId: string;
  type: "CALL" | "PUT";
  strikePrice: number;
  expiryDate: string;
  percentageChange: number;
  premium: number;
  status: "ACTIVE" | "EXPIRED" | "EXERCISED";
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  contracts: OptionContract[];
}

import { describe, it, expect } from "vitest";
import { mockCars } from "~/data/cars";
import { mockTrades } from "~/data/trades";
import { marketTrends } from "~/data/market";
import { portfolioStats } from "~/data/portfolio";

// Also test the centralized exports
import * as dataIndex from "~/data";

describe("Data Files", () => {
  describe("cars.ts", () => {
    it("exports mockCars array with correct shape", () => {
      expect(Array.isArray(mockCars)).toBe(true);
      expect(mockCars.length).toBeGreaterThan(0);

      // Test that first car has the expected shape
      const firstCar = mockCars[0];
      expect(firstCar).toHaveProperty("id");
      expect(firstCar).toHaveProperty("name");
      expect(firstCar).toHaveProperty("brand");
      expect(firstCar).toHaveProperty("model");
      expect(firstCar).toHaveProperty("year");
      expect(firstCar).toHaveProperty("imageUrl");
      expect(firstCar).toHaveProperty("currentPrice");
      expect(firstCar).toHaveProperty("priceHistory");

      // Check price history array
      expect(Array.isArray(firstCar.priceHistory)).toBe(true);
      const pricePoint = firstCar.priceHistory[0];
      expect(pricePoint).toHaveProperty("date");
      expect(pricePoint).toHaveProperty("price");
    });
  });

  describe("trades.ts", () => {
    it("exports mockTrades array with correct shape", () => {
      expect(Array.isArray(mockTrades)).toBe(true);
      expect(mockTrades.length).toBeGreaterThan(0);

      // Test that first trade has the expected shape
      const firstTrade = mockTrades[0];
      expect(firstTrade).toHaveProperty("id");
      expect(firstTrade).toHaveProperty("carId");
      expect(firstTrade).toHaveProperty("type");
      expect(firstTrade).toHaveProperty("entryPrice");
      expect(firstTrade).toHaveProperty("currentValue");
      expect(firstTrade).toHaveProperty("expiryDate");
      expect(firstTrade).toHaveProperty("percentageChange");
      expect(firstTrade).toHaveProperty("premium");

      // Check that type is either CALL or PUT
      expect(["CALL", "PUT"]).toContain(firstTrade.type);
    });
  });

  describe("market.ts", () => {
    it("exports marketTrends array with correct shape", () => {
      expect(Array.isArray(marketTrends)).toBe(true);
      expect(marketTrends.length).toBeGreaterThan(0);

      // Test that market trend items have the expected shape
      const trend = marketTrends[0];
      expect(trend).toHaveProperty("name");
      expect(trend).toHaveProperty("change");
      expect(trend).toHaveProperty("price");

      // Check data types
      expect(typeof trend.name).toBe("string");
      expect(typeof trend.change).toBe("number");
      expect(typeof trend.price).toBe("number");
    });
  });

  describe("portfolio.ts", () => {
    it("exports portfolioStats object with correct shape", () => {
      expect(portfolioStats).toBeTypeOf("object");

      // Test that portfolio stats has the expected properties
      expect(portfolioStats).toHaveProperty("totalInvested");
      expect(portfolioStats).toHaveProperty("totalValue");
      expect(portfolioStats).toHaveProperty("totalProfitLoss");
      expect(portfolioStats).toHaveProperty("percentageReturn");
      expect(portfolioStats).toHaveProperty("activePositions");
      expect(portfolioStats).toHaveProperty("cashBalance");

      // Check data types
      expect(typeof portfolioStats.totalInvested).toBe("number");
      expect(typeof portfolioStats.totalValue).toBe("number");
      expect(typeof portfolioStats.totalProfitLoss).toBe("number");
      expect(typeof portfolioStats.percentageReturn).toBe("string");
      expect(typeof portfolioStats.activePositions).toBe("number");
      expect(typeof portfolioStats.cashBalance).toBe("number");
    });
  });

  describe("data/index.ts", () => {
    it("correctly exports all data from a central location", () => {
      // Check that data index exports all the expected data
      expect(dataIndex.mockCars).toBe(mockCars);
      expect(dataIndex.mockTrades).toBe(mockTrades);
      expect(dataIndex.marketTrends).toBe(marketTrends);
      expect(dataIndex.portfolioStats).toBe(portfolioStats);
    });
  });
});

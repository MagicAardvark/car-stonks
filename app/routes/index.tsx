import { Link } from "@remix-run/react";
import Layout from "~/components/shared/Layout";
import Dashboard from "~/components/Home/Dashboard";
import { mockCars, marketTrends, portfolioStats } from "~/data";

export default function Index() {
  // Get only the first 3 cars for the popular cars section
  const popularCars = mockCars.slice(0, 3);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to CarStonks</h1>
        <p className="text-gray-600 mb-8">
          Trade options on luxury cars just like the stock market
        </p>

        {/* Dashboard */}
        <Dashboard
          totalInvested={portfolioStats.totalInvested}
          totalValue={portfolioStats.totalValue}
          totalProfitLoss={portfolioStats.totalProfitLoss}
          percentageReturn={portfolioStats.percentageReturn}
          activePositions={portfolioStats.activePositions}
          marketTrends={marketTrends}
        />

        {/* Popular Cars */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Popular Cars</h2>
            <Link
              to="/cars"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCars.map((car) => (
              <Link key={car.id} to={`/cars/${car.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {car.brand} {car.model} ({car.year})
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">
                        ${car.currentPrice.toLocaleString()}
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          car.priceHistory[car.priceHistory.length - 1].price <=
                          car.priceHistory[0].price
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {car.priceHistory[car.priceHistory.length - 1].price >
                        car.priceHistory[0].price
                          ? "+"
                          : ""}
                        {(
                          ((car.priceHistory[car.priceHistory.length - 1]
                            .price -
                            car.priceHistory[0].price) /
                            car.priceHistory[0].price) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">How CarStonks Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Choose a Car</h3>
              <p className="text-gray-600">
                Browse our selection of luxury cars and view their price
                histories
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Place a Trade</h3>
              <p className="text-gray-600">
                Select CALL (price up) or PUT (price down) and choose your terms
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Track Your Portfolio
              </h3>
              <p className="text-gray-600">
                Monitor your positions and close them for profit when the time
                is right
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

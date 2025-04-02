interface DashboardProps {
  totalInvested: number;
  totalValue: number;
  totalProfitLoss: number;
  percentageReturn: string;
  activePositions: number;
  marketTrends: {
    name: string;
    change: number;
    price: number;
  }[];
}

export default function Dashboard({
  totalInvested,
  totalValue,
  totalProfitLoss,
  percentageReturn,
  activePositions,
  marketTrends,
}: DashboardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Portfolio Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <span className="text-gray-700">Total Invested</span>
              <span className="font-bold">
                ${totalInvested.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <span className="text-gray-700">Current Value</span>
              <span className="font-bold">${totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <span className="text-gray-700">Total Profit/Loss</span>
              <span
                className={`font-bold ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {totalProfitLoss >= 0 ? "+" : ""}$
                {totalProfitLoss.toLocaleString()} ({percentageReturn}%)
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <span className="text-gray-700">Active Positions</span>
              <span className="font-bold">{activePositions}</span>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Car
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {marketTrends.map((car) => (
                  <tr key={car.name}>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {car.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-right">
                      ${car.price.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-right">
                      <span
                        className={`inline-block ${
                          car.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {car.change >= 0 ? "+" : ""}
                        {car.change.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <a
              href="/cars"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Markets →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

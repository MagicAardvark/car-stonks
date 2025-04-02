import { Link } from "@remix-run/react";
import { useState } from "react";
import { Car } from "~/types";

interface CarGridProps {
  cars: Car[];
  showFilters?: boolean;
}

export default function CarGrid({ cars, showFilters = false }: CarGridProps) {
  const [sortBy, setSortBy] = useState("price-desc");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [viewType, setViewType] = useState("grid");

  // Get unique brands and years for filter options
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand)));
  const uniqueYears = Array.from(new Set(cars.map((car) => car.year))).sort(
    (a, b) => b - a,
  );

  // Check if any filters are active
  const hasActiveFilters =
    filterBrand !== "all" || filterYear !== "all" || sortBy !== "price-desc";

  // Function to reset all filters
  const clearFilters = () => {
    setFilterBrand("all");
    setFilterYear("all");
    setSortBy("price-desc");
  };

  // Apply filters and sorting
  const filteredCars = cars.filter((car) => {
    if (
      filterBrand !== "all" &&
      car.brand.toLowerCase() !== filterBrand.toLowerCase()
    ) {
      return false;
    }
    if (filterYear !== "all" && car.year !== parseInt(filterYear)) {
      return false;
    }
    return true;
  });

  // Calculate performance values outside the case blocks
  const getPerformanceChange = (car: Car) => {
    return (
      ((car.priceHistory[car.priceHistory.length - 1].price -
        car.priceHistory[0].price) /
        car.priceHistory[0].price) *
      100
    );
  };

  // Sort cars
  const getSortedCars = (cars: Car[]) => {
    return [...cars].sort((a, b) => {
      switch (sortBy) {
        case "price-desc":
          return b.currentPrice - a.currentPrice;
        case "price-asc":
          return a.currentPrice - b.currentPrice;
        case "name":
          return a.name.localeCompare(b.name);
        case "performance":
          // Sort by percentage change over time
          return getPerformanceChange(b) - getPerformanceChange(a);
        default:
          return 0;
      }
    });
  };

  const sortedCars = getSortedCars(filteredCars);

  return (
    <>
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Sort by:</span>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price-desc">Price (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="name">Name (A-Z)</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Brand:</span>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand.toLowerCase()}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Year:</span>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button>
          )}

          <div className="flex items-center ml-auto">
            <span className="text-gray-700 mr-2">View:</span>
            <div className="flex space-x-2">
              <button
                className={`${viewType === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} p-2 rounded`}
                onClick={() => setViewType("grid")}
              >
                <span className="sr-only">Grid view</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`${viewType === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} p-2 rounded`}
                onClick={() => setViewType("list")}
              >
                <span className="sr-only">List view</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      {showFilters && (
        <div className="mb-4 text-gray-600">
          Showing {sortedCars.length} {sortedCars.length === 1 ? "car" : "cars"}
          {filterBrand !== "all" && ` in ${filterBrand}`}
          {filterYear !== "all" && ` from ${filterYear}`}
        </div>
      )}

      {/* Car grid */}
      <div
        className={`${viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}
      >
        {sortedCars.map((car) => (
          <Link key={car.id} to={`/cars/${car.id}`} className="block">
            <div
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${viewType === "list" ? "flex" : ""}`}
            >
              <div
                className={`${viewType === "grid" ? "h-48" : "h-40 w-64"} overflow-hidden`}
              >
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`${viewType === "grid" ? "p-5" : "flex-1 p-4"}`}>
                <h3 className="font-bold text-xl mb-2">{car.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {car.brand} {car.model} ({car.year})
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-xs">Current Price</p>
                    <p className="font-bold text-lg">
                      ${car.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs text-right">
                      6m Change
                    </p>
                    <p
                      className={`font-medium text-right ${
                        car.priceHistory[car.priceHistory.length - 1].price >
                        car.priceHistory[0].price
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {car.priceHistory[car.priceHistory.length - 1].price >
                      car.priceHistory[0].price
                        ? "+"
                        : ""}
                      {(
                        ((car.priceHistory[car.priceHistory.length - 1].price -
                          car.priceHistory[0].price) /
                          car.priceHistory[0].price) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex space-x-4 flex-wrap">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        car.priceHistory[car.priceHistory.length - 1].price >
                        car.priceHistory[car.priceHistory.length - 2].price
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {car.priceHistory[car.priceHistory.length - 1].price >
                      car.priceHistory[car.priceHistory.length - 2].price
                        ? "↑"
                        : "↓"}{" "}
                      Latest
                    </div>
                    <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {car.priceHistory.length} History Points
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No results message */}
      {sortedCars.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            No cars match your filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
}

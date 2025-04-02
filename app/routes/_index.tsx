import type { MetaFunction } from "@vercel/remix";
import { Link } from "@remix-run/react";
import { useMemo } from "react";
import Layout from "~/components/Layout";
import CarGrid from "~/components/CarGrid";
import { mockCars } from "~/data/cars";

export const meta: MetaFunction = () => {
  return [
    { title: "CarStonks - Luxury Car Options Trading" },
    {
      name: "description",
      content: "Trade options on the most exclusive luxury vehicles",
    },
  ];
};

export default function Index() {
  // Get 6 random cars from the collection
  const randomCars = useMemo(() => {
    const shuffled = [...mockCars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  return (
    <Layout>
      <div className="relative">
        {/* Hero section */}
        <div className="relative bg-indigo-800">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&auto=format&fit=crop&q=60"
              alt="Luxury cars"
            />
            <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trade Car Options
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
              Bet on the future of luxury cars. Trade options on your favorite
              vehicles with expiry dates and percentage changes.
            </p>
            <div className="mt-10">
              <Link
                to="/cars"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Start Trading
              </Link>
            </div>
          </div>
        </div>

        {/* Featured cars section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Featured Cars
          </h2>
          <div className="mt-6">
            <CarGrid cars={randomCars} showFilters={false} />
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/cars"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All {mockCars.length} Cars
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

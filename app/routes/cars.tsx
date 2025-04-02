import { Outlet, useLocation } from "@remix-run/react";
import Layout from "~/components/Layout";
import CarGrid from "~/components/CarGrid";
import { mockCars } from "~/data";

// This component will render at /cars path
export default function Cars() {
  // Check if we're exactly on the /cars route
  const location = useLocation();
  const isRootCarRoute = location.pathname === "/cars";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isRootCarRoute ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Car Markets</h1>
            <p className="text-gray-600 mb-8">
              Browse all available cars and place option trades
            </p>
            <CarGrid cars={mockCars} showFilters={true} />
          </>
        ) : (
          // If we're on a nested route like /cars/:id, render the child route
          <Outlet />
        )}
      </div>
    </Layout>
  );
}

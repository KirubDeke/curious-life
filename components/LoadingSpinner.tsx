"use client";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-6 animate-pulse max-w-4xl mx-auto p-4">
      {/* Simulate a title */}
      <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>

      {/* Simulate a subtitle */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>

      {/* Simulate blog cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-100 space-y-4"
          >
            <div className="h-40 bg-gray-300 rounded-md w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

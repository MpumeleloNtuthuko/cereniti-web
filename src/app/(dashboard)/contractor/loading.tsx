export default function Loading() {
  return (
    <div className="min-h-screen bg-cereniti-50 pb-20 pt-24">
      <div className="container mx-auto px-4">
        
        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 bg-cereniti-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-cereniti-100 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Job Feed Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-cereniti-200 animate-pulse" />
              <div className="h-6 w-40 bg-cereniti-100 rounded animate-pulse" />
            </div>
            
            {/* Fake Job Cards */}
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm h-64">
                <div className="bg-cereniti-100 h-16 w-full animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-cereniti-100 rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 w-full bg-cereniti-50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-cereniti-50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Schedule Skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-cereniti-200 rounded-xl p-6 shadow-sm h-96">
              <div className="h-6 w-40 bg-cereniti-200 rounded mb-6 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-cereniti-50 rounded-lg border border-cereniti-100 h-24 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
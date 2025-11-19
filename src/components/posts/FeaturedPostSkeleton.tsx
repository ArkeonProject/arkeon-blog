export default function FeaturedPostSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0f1f38]/50 border border-[#007EAD]/20 animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image skeleton */}
        <div className="w-full md:w-1/2 h-64 md:h-96 bg-gray-700/50"></div>
        
        {/* Content skeleton */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center space-y-4">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-700/50 rounded w-full mb-4"></div>
          
          {/* Date skeleton */}
          <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-4"></div>
          
          {/* Excerpt skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

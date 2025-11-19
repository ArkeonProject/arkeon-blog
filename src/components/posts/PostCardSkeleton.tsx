export default function PostCardSkeleton() {
  return (
    <div className="relative p-6 bg-[#0f1f38]/50 rounded-2xl border border-[#007EAD]/20 animate-pulse">
      {/* Image skeleton */}
      <div className="rounded-lg mb-5 w-full h-52 bg-gray-700/50"></div>
      
      {/* Title skeleton */}
      <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
      
      {/* Date skeleton */}
      <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4 pb-4 border-b border-gray-700"></div>
      
      {/* Excerpt skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
      </div>
    </div>
  );
}

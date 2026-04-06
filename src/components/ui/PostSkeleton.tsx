export default function PostSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      {/* Aspect ratio dummy for image */}
      <div className="aspect-video bg-muted/50" />
      
      <div className="p-6 space-y-4">
        {/* Category badge skeleton */}
        <div className="w-20 h-5 bg-muted/40 rounded-full" />
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="w-full h-7 bg-muted/60 rounded-lg" />
          <div className="w-3/4 h-7 bg-muted/60 rounded-lg" />
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-muted/40" />
          <div className="w-24 h-4 bg-muted/40 rounded-md" />
        </div>
      </div>
    </div>
  );
}

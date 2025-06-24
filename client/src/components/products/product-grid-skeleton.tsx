const SkeletonCard = () => (
    <div className="bg-white/80 p-4 rounded-lg shadow-md">
        <div className="aspect-[3/4] w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="mt-4 space-y-2">
            <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-5 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-300 rounded animate-pulse mt-4"></div>
        </div>
    </div>
);

export const ProductGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};
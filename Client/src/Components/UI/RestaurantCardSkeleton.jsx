import Skeleton from "./Skeleton";

const RestaurantCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <Skeleton className="w-full h-48 mb-4" />
      <Skeleton className="w-3/4 h-6 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-1/4 h-4" />
      </div>
    </div>
  );
};

export const RestaurantListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {[...Array(6)].map((_, index) => (
        <RestaurantCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default RestaurantCardSkeleton;

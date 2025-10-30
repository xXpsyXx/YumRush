import Skeleton from "./Skeleton";

const MenuItemSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <Skeleton className="w-3/4 h-6 mb-2" />
    <Skeleton className="w-1/2 h-4 mb-2" />
    <Skeleton className="w-1/4 h-4" />
  </div>
);

const RestaurantDetailsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <Skeleton className="w-full h-64 mb-6" />
    <Skeleton className="w-2/3 h-8 mb-4" />
    <Skeleton className="w-1/2 h-6 mb-8" />

    <div className="space-y-6">
      {[...Array(5)].map((_, index) => (
        <MenuItemSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default RestaurantDetailsSkeleton;

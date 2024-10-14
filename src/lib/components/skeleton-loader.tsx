import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="bg-gray-200 items-center  animate-pulse rounded-md w-[290px] h-[180px] p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/12"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

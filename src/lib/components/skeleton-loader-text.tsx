// SkeletonLoader.tsx
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-[80px]"></div>
    </div>
  );
};

export default SkeletonLoader;

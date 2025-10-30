const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      &nbsp;
    </div>
  );
};

export default Skeleton;

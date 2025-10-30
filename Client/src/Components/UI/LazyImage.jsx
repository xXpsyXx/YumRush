import { useState, useEffect } from "react";

const LazyImage = ({
  src,
  alt,
  className,
  placeholder = "/placeholder.jpg",
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        imageLoaded ? "opacity-100" : "opacity-50"
      } ${className}`}
      loading="lazy"
    />
  );
};

export default LazyImage;

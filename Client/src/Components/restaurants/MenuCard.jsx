import React from "react";

/**
 * MenuCard - A reusable menu/dish card for any restaurant, in the style of Swiggy/Zomato etc.
 * Props:
 *  - image (string): URL of menu item or fallback
 *  - title (string)
 *  - price (string | number)
 *  - description (string)
 *  - label (string, optional): e.g. bestseller, trending
 */
const MenuCard = ({ image, title, price, description, label }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg group flex flex-col">
      <div className="relative aspect-4/3 w-full bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-200">
            🍽️
          </div>
        )}
        {label && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-xs font-semibold text-white px-2 py-1 rounded-md shadow">
            {label}
          </div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {title}
          </h3>
          <span className="text-emerald-600 text-base font-bold">₹{price}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default MenuCard;

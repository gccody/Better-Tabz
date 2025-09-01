import React, { useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  action: () => void;
  disabled?: boolean;
}

interface RightClickMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

const RightClickMenu: React.FC<RightClickMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.action();
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 min-w-[150px]"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default RightClickMenu;
import React from "react";
import type { BookmarkTreeNode } from "../types";

interface CardItemProps {
  bookmark: BookmarkTreeNode;
}

const CardItem: React.FC<CardItemProps> = ({ bookmark }) => {

  const handleClick = () => {
    window.location.href = bookmark.url!
  }

  return (
    <div className="h-9 w-full bg-gray-800 cursor-pointer flex flex-row items-center px-3 hover:bg-gray-700 transition-all duration-200 border-b border-gray-700 last:border-b-0" onClick={handleClick}>
      <div className="px-1">
        <img height={16} width={16} src={`http://www.google.com/s2/favicons?domain=${bookmark.url!}`} />
      </div>
      <p className="text-white select-none" style={{ fontSize: '1rem' }}>{bookmark.title}</p>
    </div>
  )
}

export default CardItem;
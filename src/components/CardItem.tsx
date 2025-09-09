import type { BookmarkTreeNode } from "@/types";
import React from "react";

interface CardItemProps {
  bookmark: BookmarkTreeNode;
}

const CardItem: React.FC<CardItemProps> = ({ bookmark }) => {

  const handleClick = () => {
    window.location.href = bookmark.url!
  }

  return (
    <div className="h-9 w-full bg-gray-800 cursor-pointer flex flex-row items-center px-3 hover:bg-gray-700 transition-all duration-200 border-b border-gray-700 last:border-b-0" onClick={handleClick}>

      {/* Favicon */}
      <div className="p-1 bg-gray-200/20 rounded-4xl mr-1">
        <img height={16} width={16} src={`https://favdb.gccody.com/favicon?url=${bookmark.url!}`} onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = "https://favdb.gccody.com/notfound.svg"
        }} />
      </div>

      {/* Bookmark title */}
      <p className="text-white select-none" style={{ fontSize: '1rem' }}>{bookmark.title}</p>
    </div>
  )
}

export default CardItem;
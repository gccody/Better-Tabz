import CardHeader from "@/components/CardHeader";
import CardItem from "@/components/CardItem";
import RightClickMenu from "@/components/RightClickMenu";
import type { BookmarkTreeNode } from "@/types";
import { changeFolderName, deleteFolder } from "@/utils";
import { useState } from "react";

interface CardProps {
  folder: BookmarkTreeNode;
}

const Card: React.FC<CardProps> = ({ folder }) => {
  const children = folder.children?.filter((val) => val.url) ?? [];
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  }

  const handleCloseMenu = () => {
    setMenuPosition(null);
  }

  const handleEdit = () => {
    const newName = prompt("Enter new name for this folder:", folder.title);
    if (newName && newName.trim() && newName !== folder.title) {
      changeFolderName(folder.id, newName);
    }
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${folder.title}"?`)) {
      deleteFolder(folder.id);
    }
  }

  const menuItems = [
    { label: "Edit", action: handleEdit },
    { label: "Delete", action: handleDelete },
  ];

  return (
    <div className="flex flex-col rounded-lg h-96 w-80 bg-gray-800 border border-gray-700 shadow-md overflow-hidden" onContextMenu={handleContextMenu}>
      <CardHeader title={folder.title} />
      <div className="w-full overflow-auto flex flex-1 flex-col scrollbar">
        {
          children.map((bookmark) => <CardItem key={bookmark.id} bookmark={bookmark} />)
        }
      </div>
      {menuPosition && (
        <RightClickMenu
          x={menuPosition.x}
          y={menuPosition.y}
          items={menuItems}
          onClose={handleCloseMenu}
        />
      )}
    </div>
  )
}

export default Card;
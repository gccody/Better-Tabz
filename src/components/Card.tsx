import CardHeader from "@/components/CardHeader";
import CardItem from "@/components/CardItem";
import RightClickMenu from "@/components/RightClickMenu";
import type { BookmarkTreeNode } from "@/types";
import { deleteBookmarkFolder, updateBookmarkFolder } from "@/utils/browser";
import { useState } from "react";

interface CardProps {
  folder: BookmarkTreeNode;
  onBookmarkChange: () => void;
}

const Card: React.FC<CardProps> = ({ folder, onBookmarkChange }) => {
  const children = folder.children?.filter((val) => val.url) ?? [];
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  }

  const handleCloseMenu = () => {
    setMenuPosition(null);
  }

  const handleEdit = async () => {
    const newName = prompt("Enter new name for this folder:", folder.title);
    if (newName && newName.trim() && newName !== folder.title) {
      try {
        await updateBookmarkFolder(folder.id, newName.trim());
        onBookmarkChange(); // Trigger refetch after successful edit
      } catch (error) {
        console.error("Failed to update folder:", error);
        alert("Failed to update folder. Please try again.");
      }
    }
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${folder.title}"?`)) {
      try {
        await deleteBookmarkFolder(folder.id);
        onBookmarkChange(); // Trigger refetch after successful delete
      } catch (error) {
        console.error("Failed to delete folder:", error);
        alert("Failed to delete folder. Please try again.");
      }
    }
  }

  const menuItems = [
    { label: "Edit", action: handleEdit },
    { label: "Delete", action: handleDelete },
  ];

  return (
    <div className="flex flex-col rounded-lg h-96 w-full max-w-sm bg-gray-800 border border-gray-700 shadow-md overflow-hidden" onContextMenu={handleContextMenu}>
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
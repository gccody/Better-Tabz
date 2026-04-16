import CardHeader from "@/components/CardHeader";
import CardItem from "@/components/CardItem";
import RightClickMenu from "@/components/RightClickMenu";
import type { BookmarkTreeNode } from "@/types";
import { deleteBookmarkFolder, updateBookmarkFolder } from "@/utils/browser";
import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";

interface CardProps {
  folder: BookmarkTreeNode;
  onBookmarkChange: () => void;
}

const Card: React.FC<CardProps> = ({ folder, onBookmarkChange }) => {
  const children = folder.children?.filter((val) => val.url) ?? [];
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const { showPrompt, showAlert, showConfirm } = useDialog();

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  }

  const handleCloseMenu = () => {
    setMenuPosition(null);
  }

  const handleEdit = async () => {
    showPrompt(
      "Edit Folder",
      "Enter new name for this folder:",
      folder.title,
      async (newName) => {
        if (newName && newName.trim() && newName !== folder.title) {
          try {
            await updateBookmarkFolder(folder.id, newName.trim());
            onBookmarkChange();
          } catch (error) {
            console.error("Failed to update folder:", error);
            showAlert("Error", "Failed to update folder. Please try again.");
          }
        }
      }
    );
  }

  const handleDelete = async () => {
    showConfirm(
      "Delete Folder",
      `Are you sure you want to delete "${folder.title}"?`,
      async (confirmed) => {
        if (confirmed) {
          try {
            await deleteBookmarkFolder(folder.id);
            onBookmarkChange();
          } catch (error) {
            console.error("Failed to delete folder:", error);
            showAlert("Error", "Failed to delete folder. Please try again.");
          }
        }
      }
    );
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
          children.map((bookmark) => <CardItem key={bookmark.id} bookmark={bookmark} onBookmarkChange={onBookmarkChange} />)
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
import EditBookmarkModal from "@/components/EditBookmarkModal";
import RightClickMenu from "@/components/RightClickMenu";
import { useDialog } from "@/contexts/DialogContext";
import type { BookmarkTreeNode } from "@/types";
import { deleteBookmarkFolder, updateBookmark } from "@/utils/browser";
import React from "react";

interface CardItemProps {
  bookmark: BookmarkTreeNode;
  onBookmarkChange: () => void;
  folderId: string;
  itemIndex: number;
  onDragOverItem: (index: number, position: 'before' | 'after') => void;
}

const CardItem: React.FC<CardItemProps> = ({ bookmark, onBookmarkChange, folderId, itemIndex, onDragOverItem }) => {
  const [menuPosition, setMenuPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const { showAlert, showConfirm } = useDialog();

  const handleClick = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!menuPosition && !showEditModal) {
      window.location.href = bookmark.url!
    }
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  }

  const handleCloseMenu = () => {
    setMenuPosition(null);
  }

  const handleEdit = () => {
    setShowEditModal(true);
    handleCloseMenu();
  }

  const handleSaveEdit = async (id: string, title: string, url: string) => {
    try {
      await updateBookmark(id, { title, url });
      onBookmarkChange();
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      showAlert("Error", "Failed to update bookmark. Please try again.");
    }
  }

  const handleDelete = async () => {
    showConfirm(
      "Delete Bookmark",
      `Are you sure you want to delete "${bookmark.title}"?`,
      async (confirmed) => {
        if (confirmed) {
          try {
            await deleteBookmarkFolder(bookmark.id);
            onBookmarkChange();
          } catch (error) {
            console.error("Failed to delete bookmark:", error);
            showAlert("Error", "Failed to delete bookmark. Please try again.");
          }
        }
      }
    );
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent card dragstart from also firing
    e.dataTransfer.setData('application/json', JSON.stringify({ bookmarkId: bookmark.id, sourceFolderId: folderId }));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent card dragend from also firing
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Let card drags bubble up to the card's outer div handler
    if (e.dataTransfer.types.includes('application/card-json')) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    onDragOverItem(itemIndex, position);
  };

  const menuItems = [
    { label: "Edit", action: handleEdit },
    { label: "Delete", action: handleDelete },
  ];

  return (
    <div
      draggable
      className={`h-min-9 py-1 w-full bg-gray-800 cursor-pointer flex flex-row items-center px-3 hover:bg-gray-700 transition-all duration-200 border-b border-gray-700 last:border-b-0 ${isDragging ? 'opacity-40' : ''}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >

      {/* Favicon */}
      <div className="p-1 bg-gray-200/20 rounded-4xl mr-1">
        <img height={16} width={16} src={`https://favdb.gccody.com/favicon?url=${bookmark.url!}`} onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = "https://favdb.gccody.com/notfound.svg"
        }} />
      </div>

      {/* Bookmark title */}
      <p className="text-white select-none" style={{ fontSize: '1rem' }}>{bookmark.title}</p>

      {menuPosition && (
        <RightClickMenu
          x={menuPosition.x}
          y={menuPosition.y}
          items={menuItems}
          onClose={handleCloseMenu}
        />
      )}

      {showEditModal && (
        <EditBookmarkModal
          bookmark={bookmark}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}

export default CardItem;

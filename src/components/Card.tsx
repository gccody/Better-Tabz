import CardHeader from "@/components/CardHeader";
import CardItem from "@/components/CardItem";
import RightClickMenu from "@/components/RightClickMenu";
import type { BookmarkTreeNode } from "@/types";
import { deleteBookmarkFolder, moveBookmark, updateBookmarkFolder } from "@/utils/browser";
import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";

interface CardProps {
  folder: BookmarkTreeNode;
  onBookmarkChange: () => void;
}

const Card: React.FC<CardProps> = ({ folder, onBookmarkChange }) => {
  const children = folder.children?.filter((val) => val.url) ?? [];
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<number | null>(null);
  const [isDragTarget, setIsDragTarget] = useState(false);
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

  const handleDragOverItem = (index: number, position: 'before' | 'after') => {
    setIsDragTarget(true);
    setDropIndicator(position === 'before' ? index : index + 1);
  };

  const handleContainerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragTarget(true);
    // Only fires when over empty space (items stop propagation)
    setDropIndicator(children.length);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropIndicator(null);
      setIsDragTarget(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const currentIndicator = dropIndicator;
    setDropIndicator(null);
    setIsDragTarget(false);

    let data: { bookmarkId: string; sourceFolderId: string };
    try {
      data = JSON.parse(e.dataTransfer.getData('application/json'));
    } catch {
      return;
    }

    const { bookmarkId, sourceFolderId } = data;
    const targetVisualIndex = currentIndicator ?? children.length;
    const itemAtTarget = children[targetVisualIndex];

    let absoluteIndex: number;
    if (itemAtTarget) {
      absoluteIndex = (folder.children ?? []).findIndex(c => c.id === itemAtTarget.id);
    } else {
      absoluteIndex = folder.children?.length ?? 0;
    }

    // Chrome moves by removing the item first then inserting — adjust index for same-folder moves
    if (sourceFolderId === folder.id) {
      const sourceAbsoluteIndex = (folder.children ?? []).findIndex(c => c.id === bookmarkId);
      if (sourceAbsoluteIndex !== -1 && sourceAbsoluteIndex < absoluteIndex) {
        absoluteIndex--;
      }
    }

    try {
      await moveBookmark(bookmarkId, { parentId: folder.id, index: absoluteIndex });
      onBookmarkChange();
    } catch (error) {
      console.error("Failed to move bookmark:", error);
      showAlert("Error", "Failed to move bookmark. Please try again.");
    }
  };

  const menuItems = [
    { label: "Edit", action: handleEdit },
    { label: "Delete", action: handleDelete },
  ];

  return (
    <div
      className={`flex flex-col rounded-lg h-96 w-full max-w-sm bg-gray-800 border shadow-md overflow-hidden transition-colors ${isDragTarget ? 'border-blue-500/60' : 'border-gray-700'}`}
      onContextMenu={handleContextMenu}
    >
      <CardHeader title={folder.title} />
      <div
        className="w-full overflow-auto flex flex-1 flex-col scrollbar"
        onDragOver={handleContainerDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children.map((bookmark, i) => (
          <>
            {dropIndicator === i && (
              <div key={`indicator-${i}`} className="h-0.5 bg-blue-400 mx-1 rounded-full shrink-0" />
            )}
            <CardItem
              key={bookmark.id}
              bookmark={bookmark}
              onBookmarkChange={onBookmarkChange}
              folderId={folder.id}
              itemIndex={i}
              onDragOverItem={handleDragOverItem}
            />
          </>
        ))}
        {dropIndicator === children.length && (
          <div className="h-0.5 bg-blue-400 mx-1 rounded-full shrink-0" />
        )}
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

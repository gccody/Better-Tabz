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
  isDraggingCard: boolean;
  cardDropIndicator: 'before' | 'after' | null;
  onCardDragStart: (folderId: string) => void;
  onCardDragEnd: () => void;
  onCardDragOver: (targetFolderId: string, position: 'before' | 'after') => void;
  onCardDragLeave: () => void;
  onCardDrop: (targetFolderId: string, position: 'before' | 'after') => void;
}

const Card: React.FC<CardProps> = ({
  folder, onBookmarkChange,
  isDraggingCard, cardDropIndicator,
  onCardDragStart, onCardDragEnd, onCardDragOver, onCardDragLeave, onCardDrop,
}) => {
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

  const handleCardDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/card-json', JSON.stringify({ folderId: folder.id }));
    e.dataTransfer.effectAllowed = 'move';
    onCardDragStart(folder.id);
  };

  const handleDragEnd = () => {
    onCardDragEnd();
  };

  // Unified dragover: routes to card-reorder or item-drop logic based on data type.
  // CardItem stops propagation for item drags, so this only fires for:
  //   (a) item drag over empty card space, or
  //   (b) card drag over anything in this card (CardItem lets card drags bubble).
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('application/card-json')) {
      setIsDragTarget(false);
      setDropIndicator(null);
      const rect = e.currentTarget.getBoundingClientRect();
      const position = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
      onCardDragOver(folder.id, position);
    } else {
      setIsDragTarget(true);
      setDropIndicator(children.length);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropIndicator(null);
      setIsDragTarget(false);
      if (e.dataTransfer.types.includes('application/card-json')) {
        onCardDragLeave();
      }
    }
  };

  // Unified drop: routes to card-reorder or item-drop logic based on data type.
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.types.includes('application/card-json')) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
      onCardDrop(folder.id, position);
      return;
    }

    const currentIndicator = dropIndicator;
    setDropIndicator(null);
    setIsDragTarget(false);

    let data: { bookmarkId: string; sourceFolderId: string };
    try {
      data = JSON.parse(e.dataTransfer.getData('application/json'));
    } catch {
      return;
    }

    const { bookmarkId } = data;
    const targetVisualIndex = currentIndicator ?? children.length;
    const itemAtTarget = children[targetVisualIndex];

    let absoluteIndex: number;
    if (itemAtTarget) {
      absoluteIndex = (folder.children ?? []).findIndex(c => c.id === itemAtTarget.id);
    } else {
      absoluteIndex = folder.children?.length ?? 0;
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
      draggable
      className={`relative flex flex-col rounded-lg h-96 w-full max-w-sm bg-gray-800 border shadow-md overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
        isDraggingCard ? 'opacity-40' : ''
      } ${isDragTarget ? 'border-blue-500/60' : 'border-gray-700'}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleCardDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {cardDropIndicator === 'before' && (
        <div className="absolute inset-y-0 left-0 w-1 bg-blue-400 z-10 pointer-events-none rounded-l-lg" />
      )}
      {cardDropIndicator === 'after' && (
        <div className="absolute inset-y-0 right-0 w-1 bg-blue-400 z-10 pointer-events-none rounded-r-lg" />
      )}
      <CardHeader title={folder.title} />
      <div className="w-full overflow-auto flex flex-1 flex-col scrollbar">
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

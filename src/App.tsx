import "@/assets/styles.css";
import Card from "@/components/Card";
import type { BookmarkTreeNode } from "@/types";
import { getDataFolder, moveBookmark } from "@/utils/browser";
import { createBookmarkFolder } from "@/utils";
import { useEffect, useState } from "react";
import { useDialog } from "@/contexts/DialogContext";

function App() {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataFolderId, setDataFolderId] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dropTargetCardId, setDropTargetCardId] = useState<string | null>(null);
  const [cardDropPosition, setCardDropPosition] = useState<'before' | 'after' | null>(null);
  const { showPrompt, showAlert } = useDialog();

  const fetchBookmarks = async () => {
    const dataFolder = await getDataFolder();
    setDataFolderId(dataFolder.id);
    setBookmarks((dataFolder.children ?? []).filter((val) => val.url === undefined));
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleAddCard = async () => {
    showPrompt(
      "New Folder",
      "Enter a name for the new card:",
      "",
      async (folderName) => {
        if (folderName && folderName.trim()) {
          try {
            const newFolder = await createBookmarkFolder(folderName.trim());
            setBookmarks(prev => [...prev, newFolder]);
          } catch (error) {
            console.error("Failed to create folder:", error);
            showAlert("Error", "Failed to create folder. Please try again.");
          }
        }
      }
    );
  };

  const handleCardDragStart = (folderId: string) => {
    setDraggingCardId(folderId);
  };

  const handleCardDragEnd = () => {
    setDraggingCardId(null);
    setDropTargetCardId(null);
    setCardDropPosition(null);
  };

  const handleCardDragOver = (targetFolderId: string, position: 'before' | 'after') => {
    if (targetFolderId === draggingCardId) return;
    setDropTargetCardId(targetFolderId);
    setCardDropPosition(position);
  };

  const handleCardDragLeave = () => {
    setDropTargetCardId(null);
    setCardDropPosition(null);
  };

  const handleCardDrop = async (targetFolderId: string, position: 'before' | 'after') => {
    const sourceId = draggingCardId;

    setDraggingCardId(null);
    setDropTargetCardId(null);
    setCardDropPosition(null);

    if (!sourceId || !dataFolderId || sourceId === targetFolderId) return;

    const sourceIndex = bookmarks.findIndex(b => b.id === sourceId);
    const targetIndex = bookmarks.findIndex(b => b.id === targetFolderId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;

    try {
      await moveBookmark(sourceId, { parentId: dataFolderId, index: insertIndex });
      fetchBookmarks();
    } catch (error) {
      console.error("Failed to move card:", error);
      showAlert("Error", "Failed to move card. Please try again.");
    }
  };

  if (loading)
    return <div className="bg-gray-900"></div>

  return (
    <div className="min-h-screen w-full bg-gray-900 p-4 overflow-auto scrollbar">
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {bookmarks.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[50vh] text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-600/30 shadow-lg">
              <p className="text-white text-lg font-medium mb-2 opacity-90">You need to add some folders to the BetterTabz folder by clicking the plus in the bottom left</p>
              <p className="text-gray-300 text-sm opacity-80">then add some bookmarks to those sub folders</p>
            </div>
          </div>
        ) : (
          bookmarks.map((folder) => (
            <Card
              key={folder.id}
              folder={folder}
              onBookmarkChange={fetchBookmarks}
              isDraggingCard={draggingCardId === folder.id}
              cardDropIndicator={dropTargetCardId === folder.id ? cardDropPosition : null}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onCardDragOver={handleCardDragOver}
              onCardDragLeave={handleCardDragLeave}
              onCardDrop={handleCardDrop}
            />
          ))
        )}
      </div>
      <button
        className="fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:opacity-100 opacity-50 transition-opacity"
        onClick={handleAddCard}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}

export default App;

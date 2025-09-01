import "@/assets/styles.css";
import Card from "@/components/Card";
import type { BookmarkTreeNode } from "@/types";
import { createBookmarkFolder, getBookmarks } from "@/utils";
import { useEffect, useState } from "react";

function App() {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setBookmarks((await getBookmarks()).filter((val) => val.url === undefined));
      setLoading(false);
    }
    fetchBookmarks();
  }, []);

  const handleAddCard = async () => {
    const folderName = prompt("Enter a name for the new card:");
    if (folderName && folderName.trim()) {
      try {
        const newFolder = await createBookmarkFolder(folderName.trim());
        setBookmarks(prev => [...prev, newFolder]);
      } catch (error) {
        console.error("Failed to create folder:", error);
        alert("Failed to create folder. Please try again.");
      }
    }
  };

  if (loading)
    return <div className="bg-gray-900"></div>

  return (
    <div className="flex flex-row w-dvw h-dvh gap-4 p-4 bg-gray-900 overflow-auto flex-wrap scrollbar">
      {bookmarks.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-600/30 shadow-lg">
            <p className="text-white text-lg font-medium mb-2 opacity-90">You need to add some folders to the BetterTabz folder by clicking the plus in the bottom left</p>
            <p className="text-gray-300 text-sm opacity-80">then add some bookmarks to those sub folders</p>
          </div>
        </div>
      ) : (
        bookmarks.map((folder) => <Card folder={folder} />)
      )}
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

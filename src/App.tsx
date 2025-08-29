import { useEffect, useState } from "react";
import "./assets/styles.css";
import Card from "./components/Card";
import type { BookmarkTreeNode } from "./types";
import { getBookmarks } from "./utils";

function App() {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setBookmarks((await getBookmarks()).filter((val) => val.url === undefined));
    }
    fetchBookmarks();
  }, []);

  return (
    <div className="flex flex-row w-dvw h-dvh gap-4 p-4 bg-gray-900">
      {bookmarks.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-600/30 shadow-lg">
            <p className="text-white text-lg font-medium mb-2 opacity-90">You need to add some folders to the BetterTabz folder</p>
            <p className="text-gray-300 text-sm opacity-80">then add some bookmarks to those sub folders</p>
          </div>
        </div>
      ) : (
        bookmarks.map((folder) => <Card folder={folder} />)
      )}
    </div>
  )
}

export default App;

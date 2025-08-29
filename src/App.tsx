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
    <div className="flex flex-row w-dvw h-dvh gap-2 p-2" style={{ backgroundColor: "#2d2e31" }}>
      {bookmarks.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-center text-white">
          <div>
            <p className="text-lg mb-2">You need to add some folders to the BetterTabz folder</p>
            <p>then add some bookmarks to those sub folders</p>
          </div>
        </div>
      ) : (
        bookmarks.map((folder) => <Card folder={folder} />)
      )}
    </div>
  )
}

export default App;

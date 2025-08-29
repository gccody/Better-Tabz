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
      {
        bookmarks.map((folder) => <Card folder={folder} />)
      }
    </div>
  )
}

export default App;

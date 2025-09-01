import type { BookmarkTreeNode } from "@/types";
import { getBrowser, getDataFolder } from "@/utils/browser";

export const getBookmarks = (): Promise<BookmarkTreeNode[]> =>
  new Promise(async (resolve) => {
    const dataFolder = await getDataFolder();
    resolve(dataFolder.children ?? []);
  });

export const createBookmarkFolder = (title: string): Promise<BookmarkTreeNode> =>
  new Promise(async (resolve) => {
    const dataFolder = await getDataFolder();
    const browserInstance = getBrowser();
    
    const newFolder = await browserInstance.bookmarks.create({
      parentId: dataFolder.id,
      title: title
    });

    resolve(newFolder);
  });
import firefox from "webextension-polyfill";
import type { BookmarkTreeNode } from "@/types";

/**
 * Gets the browser instance (chrome or firefox)
 */
export const getBrowser = () => {
  if (typeof firefox === "undefined") {
    return chrome;
  } else {
    return firefox;
  }
};

/**
 * Gets the appropriate "Other bookmarks" title based on browser
 */
export const getOtherBookmarksTitle = () => {
  const browser = getBrowser();
  return browser === chrome ? "Other bookmarks" : "Other Bookmarks";
};

/**
 * Gets or creates the BetterTabz data folder
 */
export const getDataFolder = async (): Promise<BookmarkTreeNode> => {
  const browser = getBrowser();
  const otherBookmarksTitle = getOtherBookmarksTitle();
  const dataFolderTitle = "BetterTabz";
  
  const tree = (await browser.bookmarks.getTree())[0];
  const otherBookmarks = tree.children?.find((val) => 
    val.title.toLowerCase() === otherBookmarksTitle.toLowerCase()
  ) ?? await browser.bookmarks.create({ 
    parentId: tree.id, 
    title: otherBookmarksTitle 
  });
  
  const dataFolder = otherBookmarks.children?.find((val) => 
    val.title.toLowerCase() === dataFolderTitle.toLowerCase()
  ) ?? await browser.bookmarks.create({ 
    parentId: otherBookmarks.id, 
    title: dataFolderTitle 
  });
  
  return dataFolder;
};
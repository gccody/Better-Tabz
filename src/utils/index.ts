import firefox from "webextension-polyfill";
import type { BookmarkTreeNode } from "../types";

export const getBookmarks = (): Promise<BookmarkTreeNode[]> =>
  new Promise(async (resolve) => {

    let browser;
    if (typeof firefox === "undefined")
      browser = chrome;
    else
      browser = firefox

    const otherBookmarksTitle = typeof firefox === "undefined" ? "Other bookmarks" : "Other Bookmarks";
    const dataFolderTitle = "BetterTabz";
    const tree = (await browser.bookmarks.getTree())[0];
    const otherBookmarks = tree.children?.find((val) => val.title.toLowerCase() === otherBookmarksTitle.toLowerCase())  ?? await browser.bookmarks.create({ parentId: tree.id, title: otherBookmarksTitle });
    const dataFolder = otherBookmarks.children?.find((val => val.title.toLowerCase() === dataFolderTitle.toLowerCase())) ?? await browser.bookmarks.create({ parentId: otherBookmarks.id, title: dataFolderTitle });

    resolve(dataFolder.children ?? []);
  });
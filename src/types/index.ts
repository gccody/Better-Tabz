import browser from 'webextension-polyfill';

export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode | browser.Bookmarks.BookmarkTreeNode;
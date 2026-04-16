import React, { useEffect, useRef } from "react";
import type { BookmarkTreeNode } from "@/types";

interface EditBookmarkModalProps {
  bookmark: BookmarkTreeNode;
  onSave: (id: string, title: string, url: string) => void;
  onClose: () => void;
}

const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({ bookmark, onSave, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleInputRef.current?.value.trim() || "";
    const url = urlInputRef.current?.value.trim() || "";

    if (title && url) {
      onSave(bookmark.id, title, url);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-white text-lg font-medium mb-4">Edit Bookmark</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Name
            </label>
            <input
              ref={titleInputRef}
              type="text"
              defaultValue={bookmark.title}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bookmark name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              URL
            </label>
            <input
              ref={urlInputRef}
              type="url"
              defaultValue={bookmark.url}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookmarkModal;

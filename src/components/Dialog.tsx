import React, { useEffect, useState } from "react";
import { useDialog } from "@/contexts/DialogContext";

const Dialog: React.FC = () => {
  const { dialogs, closeDialog } = useDialog();
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormValues({});
  }, [dialogs]);

  const handleConfirm = (dialog: typeof dialogs[0]) => {
    if (dialog.type === "prompt") {
      const value = formValues["value"] || dialog.defaultValue || "";
      dialog.onConfirm?.(value);
    } else if (dialog.type === "custom" && dialog.fields) {
      const values: Record<string, string> = {};
      dialog.fields.forEach((field) => {
        values[field.name] = formValues[field.name] || field.defaultValue || "";
      });
      dialog.onConfirm?.(values);
    } else {
      dialog.onConfirm?.(true);
    }
    closeDialog(dialog.id);
  };

  const handleCancel = (dialog: typeof dialogs[0]) => {
    dialog.onCancel?.();
    closeDialog(dialog.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, dialog: typeof dialogs[0]) => {
    if (e.key === "Escape") {
      handleCancel(dialog);
    }
  };

  if (dialogs.length === 0) return null;

  return (
    <>
      {dialogs.map((dialog) => (
        <div
          key={dialog.id}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => handleCancel(dialog)}
          onKeyDown={(e) => handleKeyDown(e, dialog)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-lg font-medium mb-2">{dialog.title}</h2>

            {dialog.message && (
              <p className="text-gray-300 text-sm mb-4">{dialog.message}</p>
            )}

            {dialog.type === "prompt" && (
              <div className="mb-4">
                <input
                  type="text"
                  defaultValue={dialog.defaultValue}
                  autoFocus
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFormValues({ "value": e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirm(dialog);
                    if (e.key === "Escape") handleCancel(dialog);
                  }}
                />
              </div>
            )}

            {dialog.type === "custom" && dialog.fields && (
              <div className="space-y-4 mb-6">
                {dialog.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-white text-sm font-medium mb-2">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <input
                      type={field.type || "text"}
                      defaultValue={field.defaultValue}
                      autoFocus={field.name === dialog.fields?.[0]?.name}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3">
              {(dialog.type === "confirm" || dialog.type === "custom") && (
                <button
                  type="button"
                  onClick={() => handleCancel(dialog)}
                  className="px-4 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  {dialog.cancelText || "Cancel"}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleConfirm(dialog)}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {dialog.confirmText || (dialog.type === "confirm" ? "OK" : "Save")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Dialog;


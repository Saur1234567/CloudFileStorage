import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

// dialog: { type: 'delete' | 'rename' | 'move' | 'createFolder', payload }
export function UIProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, item, kind }
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openDialog = (type, payload = null) => setDialog({ type, payload });
  const closeDialog = () => setDialog(null);

  const openContextMenu = (e, item, kind) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item, kind });
  };
  const closeContextMenu = () => setContextMenu(null);

  return (
    <UIContext.Provider
      value={{
        dialog,
        openDialog,
        closeDialog,
        previewItem,
        setPreviewItem,
        contextMenu,
        openContextMenu,
        closeContextMenu,
        mobileSidebarOpen,
        setMobileSidebarOpen
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);

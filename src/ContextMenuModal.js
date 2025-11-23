// src/ContextMenuModal.js
import React, { useEffect } from "react";
import "./styles/context.css";
import { FaTrashAlt, FaSyncAlt, FaFolderPlus } from "react-icons/fa";

const ContextMenuModal = ({ x, y, onDelete, onClose, darkMode }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".context-menu-modal")) {
        onClose && onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className={`context-menu-modal ${darkMode ? "dark-mode" : ""}`}
      style={{ top: y, left: x, position: "fixed", zIndex: 9999 }}
    >
      <div className="context-menu-item" onClick={onDelete}><FaTrashAlt /> Delete</div>
      <div className="context-menu-item"><FaSyncAlt /> Refresh</div>
      <div className="context-menu-item"><FaFolderPlus /> New Folder</div>
    </div>
  );
};

export default ContextMenuModal;

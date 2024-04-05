import React, { useEffect } from 'react';
import './styles/context.css';

const ContextMenuModal = ({ x, y, onDelete, onClose, darkMode }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the modal
      if (!event.target.closest('.context-menu-modal')) {
        onClose();
      }
    };

    // Attach event listener when component mounts
    document.addEventListener('click', handleClickOutside);

    // Detach event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={`context-menu-modal ${darkMode ? "dark-mode" : ""}`} style={{ top: y, left: x }}>
      <div className="context-menu-item" onClick={onDelete}>
        Delete
      </div>

      <div className="context-menu-item">
        Refresh
      </div>

      <div className="context-menu-item">
        NewFolder
      </div>
    </div>
  );
};

export default ContextMenuModal;

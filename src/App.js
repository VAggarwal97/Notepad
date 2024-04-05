import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Bin from './Bin';
import ContextMenuModal from './ContextMenuModal';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);
  const [folders, setFolders] = useState(JSON.parse(localStorage.getItem('folders')) || []);
  const [files, setFiles] = useState(JSON.parse(localStorage.getItem('files')) || []);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [binPageVisible, setBinPageVisible] = useState(false);
  const [binFiles, setBinFiles] = useState(JSON.parse(localStorage.getItem('binFiles')) || []);
  const [binFolders, setBinFolders] = useState(JSON.parse(localStorage.getItem('binFolders')) || []);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setBinPageVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const storedFolders = localStorage.getItem('folders');
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('binFiles', JSON.stringify(binFiles));
  }, [binFiles]);

  useEffect(() => {
    localStorage.setItem('binFolders', JSON.stringify(binFolders));
  }, [binFolders]);

  useEffect(() => {
    if (selectedFolderIndex !== null) {
      setFiles(folders[selectedFolderIndex]?.files || []);
    }
  }, [selectedFolderIndex, folders]);

  useEffect(() => {
    if (selectedFileIndex !== null) {
      setFileContent(files[selectedFileIndex]?.content || '');
    }
  }, [selectedFileIndex, files]);

  const deleteAll = () => {
    // Clear binFiles and binFolders arrays
    setBinFiles([]);
    setBinFolders([]);

    // Clear localStorage
    localStorage.removeItem('binFiles');
    localStorage.removeItem('binFolders');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can also save the dark mode status in localStorage if you want to persist it
    localStorage.setItem('darkMode', !darkMode);
  };

  const filteredFiles = files.filter((file) =>
    file && file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderClick = (index) => {
    setSelectedFolderIndex(index);
  };

  const handleFileClick = (index) => {
    setSelectedFileIndex(index);
  };

  const handleNewFolder = () => {
    const newFolder = {
      id: Date.now(), // Generating a unique ID for the new folder
      name: `New Folder`,
      files: [],
    };
    const newFolders = [...folders, newFolder];
    setFolders(newFolders);
  };

  const handleNewFile = () => {
    if (selectedFolderIndex !== null) {
      const newFile = {
        id: Date.now(), // Generating a unique ID for the new file
        name: `New File`,
        content: '',
      };
      const updatedFiles = [...files, newFile];
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = {
        ...updatedFolders[selectedFolderIndex],
        files: updatedFiles,
      };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
      setSelectedFileIndex(updatedFiles.length - 1);
      setFileContent('');
    }
  };

  const handleDeleteFolder = (index) => {
    const deletedFolder = folders[index];
    const updatedFolders = folders.filter((folder, i) => i !== index);

    // Move deleted folder to bin
    setBinFolders([...binFolders, deletedFolder]);

    // Delete all files within the deleted folder and move them to bin
    const deletedFiles = deletedFolder.files.map((file) => {
      return { ...file, folderId: null }; // Remove folderId association
    });

    setBinFiles([...binFiles, ...deletedFiles]);

    setFolders(updatedFolders);
    setFiles([]);
    setSelectedFolderIndex(null);
    setSelectedFileIndex(null);
    setFileContent('');
  };

  const handleDeleteFile = (indexToDelete) => {
    if (selectedFolderIndex !== null && indexToDelete !== null) {
      const deletedFile = files[indexToDelete];
      const updatedFiles = files.filter((file, i) => i !== indexToDelete);
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = {
        ...updatedFolders[selectedFolderIndex],
        files: updatedFiles,
      };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
      setSelectedFileIndex(null);
      setFileContent('');

      // Move deleted file to bin
      setBinFiles([...binFiles, deletedFile]);
    }
  };

  const handleFolderNameChange = (event, id) => {
    const newName = event.target.value;
    const updatedFolders = folders.map(folder =>
      folder.id === id ? { ...folder, name: newName } : folder
    );
    setFolders(updatedFolders);
  };

  const handleFileNameChange = (event, index) => {
    if (selectedFolderIndex !== null && index !== null) {
      const updatedFiles = [...files];
      updatedFiles[index] = {
        ...updatedFiles[index],
        name: event.target.value,
      };
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = {
        ...updatedFolders[selectedFolderIndex],
        files: updatedFiles,
      };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
    }
  };

  const handleFileContentChange = (event) => {
    setFileContent(event.target.value);
    if (selectedFolderIndex !== null && selectedFileIndex !== null) {
      const updatedFiles = [...files];
      updatedFiles[selectedFileIndex] = {
        ...updatedFiles[selectedFileIndex],
        content: event.target.value,
      };
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = {
        ...updatedFolders[selectedFolderIndex],
        files: updatedFiles,
      };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
    }
  };

  const handleContextMenu = (event, index, type) => {
    event.preventDefault();
    setContextMenu({ index, type, x: event.clientX, y: event.clientY });
    const handleClickOutside = (event) => {
      if (!event.target.closest('.context-menu-modal')) {
        setContextMenu(null);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    document.addEventListener('click', handleClickOutside);
  };

  const handleContextOption = (option) => {
    if (contextMenu.type === 'folder' && option === 'delete') {
      handleDeleteFolder(contextMenu.index);
    } else if (contextMenu.type === 'file' && option === 'delete') {
      handleDeleteFile(contextMenu.index);
    }
    setContextMenu(null);
  };

  const handleBinClick = () => {
    setBinPageVisible(!binPageVisible);
  };

  const handleRestore = (type, index) => {
    if (type === 'folder') {
      const restoredFolder = binFolders[index];
      if (!restoredFolder) {
        console.error('Restored folder not found.');
        return;
      }
      setFolders([...folders, restoredFolder]);
      const updatedBinFolders = binFolders.filter((folder, i) => i !== index);
      setBinFolders(updatedBinFolders);
    } else if (type === 'file') {
      const restoredFile = binFiles[index];
      if (!restoredFile) {
        console.error('Restored file not found.');
        return;
      }

      // Create a new folder for restored files named "Restored Files" if it doesn't exist
      let restoredFilesFolderIndex = folders.findIndex(folder => folder.name === 'Restored Files');
      if (restoredFilesFolderIndex === -1) {
        const restoredFilesFolder = {
          name: 'Restored Files',
          files: [restoredFile]
        };
        setFolders([...folders, restoredFilesFolder]);
      } else {
        // Add the restored file to the existing "Restored Files" folder
        const updatedFolders = [...folders];
        updatedFolders[restoredFilesFolderIndex].files.push(restoredFile);
        setFolders(updatedFolders);
      }

      // Remove the restored file from the bin
      const updatedBinFiles = binFiles.filter((file, i) => i !== index);
      setBinFiles(updatedBinFiles);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar">
        <div className="search-bar">
          <li>
            <input
              className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </li>
        </div>
        <button onClick={handleNewFolder}>New Folder</button>
        <ul>
          {folders.map((folder, index) => (
            <li
              key={index}
              onClick={() => handleFolderClick(index)}
              onContextMenu={(event) => handleContextMenu(event, index, 'folder')}
              className={index === selectedFolderIndex ? 'selected' : ''}
            >
              <input
                className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
                type="text"
                value={folder.name} // Accessing the name property
                onChange={(e) => handleFolderNameChange(e, folder.id)}
              />
            </li>
          ))}
        </ul>
        {contextMenu && (
          <ContextMenuModal
            x={contextMenu.x}
            y={contextMenu.y}
            darkMode={darkMode}
            onDelete={() => handleContextOption('delete')}
          />
        )}
        <div className="sidebar-bottom-left">
          <div className="sidebar-icons">
            <div className="bin-icon" onClick={handleBinClick}>
              <span role="img" aria-label="Bin">
                🗑️
              </span>
            </div>
            <div className="dark-mode-toggle" onClick={toggleDarkMode}>
              <span className='iconsize' role="img" aria-label="Dark mode">{darkMode ? '🌞' : '🌙'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="files-sidebar">
        {selectedFolderIndex !== null && (
          <>
            <div className="new-file" onClick={handleNewFile}>
              <span role="img" aria-label="Plus">
                ➕ Add
              </span>
            </div>
            <div className="filesidedown">
              <ul>
                {filteredFiles.map((file, index) => (
                  <li
                    key={index}
                    onClick={() => handleFileClick(index)}
                    onContextMenu={(event) => handleContextMenu(event, index, 'file')}
                    className={index === selectedFileIndex ? 'selected' : ''}
                  >
                    <input
                      className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
                      type="text"
                      value={file.name} // Accessing the name property
                      onChange={(e) => handleFileNameChange(e, index)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="editor">
        {selectedFileIndex !== null && (
          <textarea
            className={`editor-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
            value={fileContent}
            onChange={handleFileContentChange}
            placeholder="Type your note here..."
          />
        )}
      </div>
      {binPageVisible && <Bin binFiles={binFiles} binFolders={binFolders} onClose={handleBinClick} onDeleteAll={deleteAll} onRestore={handleRestore} darkMode={darkMode} />}
    </div>
  );
}

export default App;

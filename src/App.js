// src/App.js
import React, { useEffect, useState, useRef } from 'react';
import './styles/App.css';
import './styles/editor.css';
import Bin from './Bin';
import ContextMenuModal from './ContextMenuModal';
import Editor from './Editor';

import TurndownService from 'turndown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';





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
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved'
  const saveTimerRef = useRef(null);

  useEffect(() => {
    const storedFolders = localStorage.getItem('folders');
    if (storedFolders) setFolders(JSON.parse(storedFolders));
  }, []);

  useEffect(() => localStorage.setItem('folders', JSON.stringify(folders)), [folders]);
  useEffect(() => localStorage.setItem('files', JSON.stringify(files)), [files]);
  useEffect(() => localStorage.setItem('binFiles', JSON.stringify(binFiles)), [binFiles]);
  useEffect(() => localStorage.setItem('binFolders', JSON.stringify(binFolders)), [binFolders]);

  useEffect(() => {
    if (selectedFolderIndex !== null) setFiles(folders[selectedFolderIndex]?.files || []);
  }, [selectedFolderIndex, folders]);

  useEffect(() => {
    if (selectedFileIndex !== null) setFileContent(files[selectedFileIndex]?.content || '');
  }, [selectedFileIndex, files]);

  const deleteAll = () => {
    setBinFiles([]);
    setBinFolders([]);
    localStorage.removeItem('binFiles');
    localStorage.removeItem('binFolders');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const filteredFiles = files.filter((file) =>
    file && file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderClick = (index) => {
    setSelectedFolderIndex(index);
    setSelectedFileIndex(null);
    setFileContent('');
  };

  const handleFileClick = (index) => {
    setSelectedFileIndex(index);
  };

  const handleNewFolder = () => {
    const newFolder = { id: Date.now(), name: 'New Folder', files: [] };
    setFolders([...folders, newFolder]);
  };

  const handleNewFile = () => {
    if (selectedFolderIndex !== null) {
      const newFile = { id: Date.now(), name: 'New File', content: '' };
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
    const updatedFolders = folders.filter((_, i) => i !== index);
    setBinFolders([...binFolders, deletedFolder]);
    const deletedFiles = (deletedFolder.files || []).map(file => ({ ...file, folderId: null }));
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
      const updatedFiles = files.filter((_, i) => i !== indexToDelete);
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = {
        ...updatedFolders[selectedFolderIndex],
        files: updatedFiles,
      };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
      setSelectedFileIndex(null);
      setFileContent('');
      setBinFiles([...binFiles, deletedFile]);
    }
  };

  const handleFolderNameChange = (event, id) => {
    const newName = event.target.value;
    const updatedFolders = folders.map(folder => folder.id === id ? { ...folder, name: newName } : folder);
    setFolders(updatedFolders);
  };

  const handleFileNameChange = (event, index) => {
    if (selectedFolderIndex !== null && index !== null) {
      const updatedFiles = [...files];
      updatedFiles[index] = { ...updatedFiles[index], name: event.target.value };
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = { ...updatedFolders[selectedFolderIndex], files: updatedFiles };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
    }
  };

  /* -----------------------------
     Editor update handler (autosave UI)
     ----------------------------- */
  const handleEditorUpdate = (html) => {
    setFileContent(html);

    // update the currently selected file in state
    if (selectedFolderIndex !== null && selectedFileIndex !== null) {
      const updatedFiles = [...files];
      updatedFiles[selectedFileIndex] = { ...updatedFiles[selectedFileIndex], content: html };
      const updatedFolders = [...folders];
      updatedFolders[selectedFolderIndex] = { ...updatedFolders[selectedFolderIndex], files: updatedFiles };
      setFiles(updatedFiles);
      setFolders(updatedFolders);
    }

    // autosave indicator (debounced)
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 1200);
    }, 700);
  };

  const handleContextMenu = (event, index, type) => {
    event.preventDefault();
    setContextMenu({ index, type, x: event.clientX, y: event.clientY });
    const handleClickOutside = (ev) => {
      if (!ev.target.closest('.context-menu-modal')) {
        setContextMenu(null);
        document.removeEventListener('click', handleClickOutside);
      }
    };
    document.addEventListener('click', handleClickOutside);
  };

  const handleContextOption = (option) => {
    if (!contextMenu) return;
    if (contextMenu.type === 'folder' && option === 'delete') handleDeleteFolder(contextMenu.index);
    if (contextMenu.type === 'file' && option === 'delete') handleDeleteFile(contextMenu.index);
    setContextMenu(null);
  };

  const handleBinClick = () => setBinPageVisible(!binPageVisible);

  const handleRestore = (type, index) => {
    if (type === 'folder') {
      const restoredFolder = binFolders[index];
      if (!restoredFolder) return;
      setFolders([...folders, restoredFolder]);
      setBinFolders(binFolders.filter((_, i) => i !== index));
    } else if (type === 'file') {
      const restoredFile = binFiles[index];
      if (!restoredFile) return;
      let restoredFilesFolderIndex = folders.findIndex(f => f.name === 'Restored Files');
      if (restoredFilesFolderIndex === -1) {
        const restoredFilesFolder = { id: Date.now(), name: 'Restored Files', files: [restoredFile] };
        setFolders([...folders, restoredFilesFolder]);
      } else {
        const updatedFolders = [...folders];
        updatedFolders[restoredFilesFolderIndex].files.push(restoredFile);
        setFolders(updatedFolders);
      }
      setBinFiles(binFiles.filter((_, i) => i !== index));
    }
  };

  /* -----------------------------
     EXPORTS: TXT / MD / PDF
     ----------------------------- */
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  const downloadUrl = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const exportAsTxt = (file) => {
    const text = stripHtml(file.content || '');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, `${file.name || 'document'}.txt`);
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = (file) => {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(file.content || '');
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, `${file.name || 'document'}.md`);
    URL.revokeObjectURL(url);
  };

  const exportAsPdf = async (file) => {
    const wrapper = document.createElement('div');
    wrapper.style.width = '800px';
    wrapper.style.padding = '24px';
    wrapper.style.background = '#fff';
    wrapper.innerHTML = file.content || '<div></div>';
    document.body.appendChild(wrapper);

    try {
      const canvas = await html2canvas(wrapper, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${file.name || 'document'}.pdf`);
    } catch (err) {
      console.error('PDF export error', err);
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  /* -----------------------------
     Full-text search across contents
     ----------------------------- */
  const filesMatchingContent = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = [];
    folders.forEach((folder, fi) => {
      (folder.files || []).forEach((file, fli) => {
        const text = stripHtml(file.content || '').toLowerCase();
        if (text.includes(q) || (file.name || '').toLowerCase().includes(q)) {
          results.push({ folderIndex: fi, fileIndex: fli, file, folderName: folder.name });
        }
      });
    });
    return results;
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="search-bar">
          <li>
            <input
              className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
              type="text"
              placeholder="Search folders/files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </li>
        </div>

        <button onClick={handleNewFolder}>New Folder</button>

        <ul>
          {folders.map((folder, index) => (
            <li
              key={folder.id || index}
              onClick={() => handleFolderClick(index)}
              onContextMenu={(event) => handleContextMenu(event, index, 'folder')}
              className={index === selectedFolderIndex ? 'selected' : ''}
            >
              <input
                className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
                type="text"
                value={folder.name}
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

        <div style={{ marginTop: 10 }}>
          <input
            className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
            placeholder="Search inside content..."
            value={contentSearchQuery}
            onChange={(e) => setContentSearchQuery(e.target.value)}
          />
          <div className="search-results">
            {contentSearchQuery && filesMatchingContent(contentSearchQuery).map((r, i) => (
              <div
                key={i}
                className="search-result"
                onClick={() => {
                  setSelectedFolderIndex(r.folderIndex);
                  setSelectedFileIndex(r.fileIndex);
                }}
              >
                <strong>{r.file.name}</strong> — <em>{r.folderName}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-bottom-left">
          <div className="autosave-indicator">
            {saveStatus === 'saving' && <span>Saving…</span>}
            {saveStatus === 'saved' && <span>Saved ✔</span>}
          </div>
          <div className="sidebar-icons">
            <div className="bin-icon" onClick={handleBinClick}><span role="img" aria-label="Bin">🗑️</span></div>
            <div className="dark-mode-toggle" onClick={toggleDarkMode}>
              <span className='iconsize' role="img" aria-label="Dark mode">{darkMode ? '🌞' : '🌙'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILES SIDEBAR */}
      <div className="files-sidebar">
        {selectedFolderIndex !== null && (
          <>
            <div className="new-file" onClick={handleNewFile}><span role="img" aria-label="Plus">➕ Add</span></div>

            <div className="filesidedown">
              <ul>
                {filteredFiles.map((file, index) => (
                  <li
                    key={file.id || index}
                    onClick={() => handleFileClick(index)}
                    onContextMenu={(event) => handleContextMenu(event, index, 'file')}
                    className={index === selectedFileIndex ? 'selected' : ''}
                  >
                    <input
                      className={`input-textarea ${darkMode ? 'dark-mode-textarea' : ''}`}
                      type="text"
                      value={file.name}
                      onChange={(e) => handleFileNameChange(e, index)}
                    />
                    <div className="file-actions">
                      <button onClick={(ev) => { ev.stopPropagation(); exportAsTxt(file); }}>TXT</button>
                      <button onClick={(ev) => { ev.stopPropagation(); exportAsMarkdown(file); }}>MD</button>
                      <button onClick={(ev) => { ev.stopPropagation(); exportAsPdf(file); }}>PDF</button>
                      <button onClick={(ev) => { ev.stopPropagation(); handleDeleteFile(index); }}>Del</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* EDITOR (right) */}
      <div className="editor">
        {selectedFileIndex !== null && (
          <div className="editor-container">


            <Editor
              content={fileContent}
              onUpdate={handleEditorUpdate}
              placeholder="Type / for commands — headings, lists, images, callout..."
              darkMode={darkMode}
            />
          </div>
        )}
      </div>

      {binPageVisible && (
        <Bin
          binFiles={binFiles}
          binFolders={binFolders}
          onClose={handleBinClick}
          onDeleteAll={deleteAll}
          onRestore={handleRestore}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;

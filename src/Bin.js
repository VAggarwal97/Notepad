// src/Bin.js
import React, { useEffect } from "react";
import "./styles/Bin.css";

function Bin({ binFiles = [], binFolders = [], onClose, onRestore, onDeleteAll, darkMode }) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    useEffect(() => {
        localStorage.setItem("binFiles", JSON.stringify(binFiles));
        localStorage.setItem("binFolders", JSON.stringify(binFolders));
    }, [binFiles, binFolders]);

    return (
        <div className="bin-modal">
            <div className={`bin-content ${darkMode ? "dark" : ""}`}>
                <button className="deleteall" onClick={onDeleteAll}>Delete All</button>
                <h2 className="binheading">Bin</h2>
                <span className="close-btn" onClick={onClose}>&times;</span>

                <div className="ffcontainer">
                    <div className="folders">
                        <h3>Folders</h3>
                        <ul>
                            {binFolders.map((folder, i) => (
                                <li key={i}>
                                    {folder.name} <br />
                                    <span className="date">{currentDate}</span> - <span className="time">{currentTime}</span>
                                    <button onClick={() => onRestore("folder", i)}>Restore</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="files">
                        <h3>Files</h3>
                        <ul>
                            {binFiles.map((file, i) => (
                                <li key={i}>
                                    {file?.name} <br />
                                    <span className="date">{currentDate}</span> - <span className="time">{currentTime}</span>
                                    <button onClick={() => onRestore("file", i)}>Restore</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bin;

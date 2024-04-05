import React, { useEffect } from 'react';
import './styles/Bin.css'; // Import CSS for styling

function Bin({ binFiles, binFolders, onClose, onRestore, onDeleteAll, darkMode }) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    useEffect(() => {
        // Save bin data to local storage
        localStorage.setItem('binFiles', JSON.stringify(binFiles));
        localStorage.setItem('binFolders', JSON.stringify(binFolders));
    }, [binFiles, binFolders]);

    const deleteAll = () => {
        // Call the onDeleteAll function passed as a prop
        onDeleteAll();
    };

    return (
        <>
            <div className="bin-modal" >
                <div className={`${darkMode ? "dark-mode" : ""}`}>
                    <div className="bin-content">

                        <button className='deleteall' onClick={deleteAll}>Delete All</button>
                        <h2 className='binheading'>Bin</h2>
                        <span className="close-btn" onClick={onClose}>&times;</span>

                        <div className="ffcontainer">

                            <div className='folders'>
                                <h3 >Folders</h3>
                                <ul>
                                    {binFolders && binFolders.map((folder, index) => (
                                        <li key={index}>
                                            {folder.name} <br /> <span className="date">{currentDate}</span> - <span className="time">{currentTime}</span>
                                            <button onClick={() => onRestore('folder', index)}>Restore</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='files'>
                                <h3>Files</h3>
                                <ul>
                                    {binFiles && binFiles.map((file, index) => (
                                        file && // Check if file exists and is not null
                                        <li key={index}>
                                            {file.name} <br /> <span className="date">{currentDate}</span> - <span className="time">{currentTime}</span>
                                            <button onClick={() => onRestore('file', index)}>Restore</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Bin;

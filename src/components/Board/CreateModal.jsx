// src/components/Board/CreateModal.jsx
import React, { useState } from "react";

export default function CreateModal({ onClose, onCreate, columns }) {
  const [col, setCol] = useState(columns[0].id);
  const [title, setTitle] = useState("");
  const [tid, setTid] = useState("NHP-" + Math.floor(Math.random()*90+10));
  const [deadline, setDeadline] = useState("");

  const submit = ()=> {
    if(!title) return alert("Title required");
    const card = { id: tid, title, avatar:"/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png", subtasks:0, total:0, deadline };
    onCreate(col, card);
  };

  return (
    <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(2,6,23,0.4)', zIndex:60}}>
      <div style={{background:'#fff', padding:20, width:420, borderRadius:12}}>
        <h3 style={{margin:0}}>Create Task</h3>
        <div style={{display:'grid', gap:10, marginTop:12}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 border rounded" />
          <input value={tid} onChange={e=>setTid(e.target.value)} placeholder="Task ID" className="px-3 py-2 border rounded" />
          <input value={deadline} onChange={e=>setDeadline(e.target.value)} placeholder="Deadline (eg 28 FEB)" className="px-3 py-2 border rounded" />
          <select value={col} onChange={e=>setCol(e.target.value)} className="px-3 py-2 border rounded">
            {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
            <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
            <button onClick={submit} className="px-3 py-2 rounded bg-blue-500 text-white">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { createProject, deleteProject, listProjects } from "@/lib/repositories";
import type { Project } from "@/lib/types";

export default function ProjectsManager(){
  const [items,setItems]=useState<Project[]>([]); const [busy,setBusy]=useState(true); const [error,setError]=useState("");
  async function load(){setBusy(true);try{setItems(await listProjects());setError("")}catch(e){setError(e instanceof Error?e.message:"Unable to load projects")}finally{setBusy(false)}}
  useEffect(()=>{void load()},[]);
  async function add(){const title=prompt("Project title"); if(!title)return; const slug=title.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-"); const image=prompt("Cover image URL"); if(!image)return; setBusy(true);try{await createProject({title,slug,category:"Other",coverImage:image,status:"draft",featured:false});await load()}catch(e){setError(e instanceof Error?e.message:"Could not create project")}finally{setBusy(false)}}
  async function remove(id?:string){if(!id||!confirm("Delete this project?"))return;setBusy(true);try{await deleteProject(id);await load()}catch(e){setError(e instanceof Error?e.message:"Could not delete project")}finally{setBusy(false)}}
  return <div><div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:28}}><div><div className="eyebrow">Firestore content</div><h1 className="display" style={{fontSize:56,margin:"8px 0"}}>Projects</h1></div><button className="btn btn-dark" onClick={add}>Add Project</button></div>{error&&<div style={{padding:14,background:"#e5d2c5",marginBottom:16}}>{error}</div>}<div style={{background:"#f3f0e8",padding:24}}>{busy?<p>Loading projects…</p>:items.length===0?<p>No projects yet. Add the first project.</p>:items.map(p=><div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 130px 100px",gap:12,padding:"17px 0",borderBottom:"1px solid rgba(23,23,20,.08)"}}><span>{p.title}</span><span>{p.category}</span><span>{p.status}</span><button onClick={()=>remove(p.id)} style={{border:0,background:"transparent",textAlign:"left",cursor:"pointer"}}>Delete</button></div>)}</div></div>
}

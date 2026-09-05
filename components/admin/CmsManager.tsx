"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteItem, listCollection, saveItem } from "@/lib/repositories";
import { slugify } from "@/lib/repositories";
import CloudinaryPicker from "@/components/admin/CloudinaryPicker";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "media" | "checkbox";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

type Config = { collection: string; title: string; singular?: string; fields: Field[] };

export default function CmsManager<T extends { id?: string }>({ config }: { config: Config }) {
  const [items, setItems] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const singular = config.singular ?? config.title.replace(/ies$/, "y").replace(/s$/, "");

  const blank = useMemo(
    () => Object.fromEntries(config.fields.map((f) => [f.key, f.type === "checkbox" ? false : f.type === "number" ? 0 : ""])) as unknown as T,
    [config.fields],
  );

  async function load() {
    setBusy(true);
    try {
      setItems(await listCollection<T>(config.collection));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load items.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { void load(); }, [config.collection]);

  function openNew() {
    setEditing(blank);
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { ...(editing as T & Record<string, unknown>) };
      if ("title" in payload && !payload.slug) payload.slug = slugify(String(payload.title));
      if ("name" in payload && !payload.slug) payload.slug = slugify(String(payload.name));
      if ((config.collection === "packages" || config.collection === "projects") && typeof payload.features === "string") {
        payload.features = String(payload.features).split("\n").map((x) => x.trim()).filter(Boolean);
      }
      if (config.collection === "projects" && typeof payload.gallery === "string") {
        payload.gallery = String(payload.gallery).split("\n").map((x) => x.trim()).filter(Boolean);
      }
      await saveItem(config.collection, payload as T);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save item.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id?: string) {
    if (!id || !window.confirm("Delete this item permanently?")) return;
    setBusy(true);
    try {
      await deleteItem(config.collection, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete item.");
    } finally {
      setBusy(false);
    }
  }

  const set = (key: string, value: unknown) => setEditing((prev) => prev ? ({ ...prev, [key]: value }) as T : prev);

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 24, gap: 20 }}>
        <div><div className="eyebrow">CMS · Firestore</div><h1 className="display" style={{ fontSize: 56, margin: "8px 0" }}>{config.title}</h1></div>
        <button className="btn btn-dark" onClick={openNew}>Add {singular}</button>
      </div>
      {error && <div style={{ padding: 14, background: "#e5d2c5", marginBottom: 14 }}>{error}</div>}

      {editing && (
        <section style={{ background: "#f3f0e8", padding: 26, marginBottom: 22, border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 18 }}>
            <div><div className="eyebrow">{editing.id ? "Edit" : "Create"}</div><h2 style={{ margin: "6px 0" }}>{singular}</h2></div>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>Close</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14 }}>
            {config.fields.map((f) => {
              const value = (editing as Record<string, unknown>)[f.key];
              const displayValue = (f.key === "features" || f.key === "gallery") && Array.isArray(value) ? value.join("\n") : String(value ?? "");
              const common = { value: displayValue, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value), required: f.required };
              const full = f.type === "textarea" || f.type === "media";
              return <div key={f.key} style={{ display: "grid", gap: 7, gridColumn: full ? "1 / -1" : "auto" }}>
                <label style={{ fontSize: 12, fontWeight: 600 }}>{f.label}</label>
                {f.type === "textarea" ? <textarea {...common} placeholder={f.placeholder} />
                  : f.type === "select" ? <select {...common}><option value="">Select…</option>{f.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                  : f.type === "checkbox" ? <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={Boolean(value)} onChange={(e) => set(f.key, e.target.checked)} style={{ width: "auto" }} /> Enabled</label>
                  : f.type === "media" ? <CloudinaryPicker value={String(value ?? "")} onChange={(v) => set(f.key, v)} folder={`phenomenal-shoots/${config.collection}`} />
                  : <input {...common} type={f.type === "number" ? "number" : "text"} placeholder={f.placeholder} />}
              </div>;
            })}
          </div>
          <button className="btn btn-dark" disabled={busy} onClick={() => void save()} style={{ marginTop: 18 }}>{busy ? "Saving…" : editing.id ? `Save ${singular}` : `Create ${singular}`}</button>
        </section>
      )}

      <section style={{ background: "#f3f0e8", padding: 25 }}>
        {busy && !items.length ? <p>Loading…</p> : items.length === 0 ? <p style={{ color: "var(--muted)" }}>No {config.title.toLowerCase()} yet. Create the first one.</p> : items.map((item) => {
          const raw = item as Record<string, unknown>;
          const name = raw.title ?? raw.name ?? raw.clientName ?? raw.question ?? "Untitled";
          return <div key={item.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(120px,.8fr) 90px 90px", gap: 12, padding: "16px 0", borderBottom: "1px solid rgba(23,23,20,.09)", alignItems: "center" }}>
            <div><strong>{String(name)}</strong><div className="eyebrow" style={{ marginTop: 4 }}>{String(raw.status ?? "")}</div></div>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{String(raw.category ?? raw.priceLabel ?? raw.role ?? "")}</span>
            <button className="btn btn-outline" onClick={() => setEditing(item)}>Edit</button>
            <button className="btn" style={{ color: "#8c3c2c" }} onClick={() => void remove(item.id)}>Delete</button>
          </div>;
        })}
      </section>
    </main>
  );
}

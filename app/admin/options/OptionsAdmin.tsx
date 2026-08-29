"use client";

import { useState } from "react";

type OptionRow = { id: number; key: string; name: string; price: number; sortOrder: number; updatedAt: string };

export default function OptionsAdmin({ initialOptions }: { initialOptions: OptionRow[] }) {
  const [options, setOptions] = useState(initialOptions);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  async function save(option: OptionRow) {
    setSaving(option.key);
    setMessages((current) => ({ ...current, [option.key]: "" }));
    const response = await fetch("/api/admin/options", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: option.key, price: option.price }),
    });
    const body = await response.json();
    setSaving(null);
    setMessages((current) => ({
      ...current,
      [option.key]: response.ok ? "Prix enregistré." : body.error ?? "Enregistrement impossible.",
    }));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return (
    <main className="admin optionsAdmin">
      <header><div><p className="eyebrow dark">KWAKO NYUMBANI</p><h1>Prix des options</h1></div><button className="adminLogout" onClick={logout}>Déconnexion</button></header>
      <p className="optionsAdminIntro">Gérez uniquement les prix affichés dans « Ajouter vos options au crédit ».</p>
      <section className="optionPriceGrid">
        {options.map((option, index) => (
          <article key={option.key}>
            <h2>{option.name}</h2>
            <label>Prix actuel<div><input type="number" min="0" max="100000000" step="1" value={option.price} onChange={(event) => setOptions((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, price: Number(event.target.value) } : row))} /><span>$US</span></div></label>
            <button disabled={saving === option.key} onClick={() => save(option)}>{saving === option.key ? "Enregistrement…" : "Enregistrer"}</button>
            {messages[option.key] && <p className={messages[option.key] === "Prix enregistré." ? "adminSuccess" : "adminError"} role="status">{messages[option.key]}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}

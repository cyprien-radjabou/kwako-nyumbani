"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
    });
    const body = await response.json();
    setBusy(false);
    if (!response.ok) return setError(body.error ?? "Connexion impossible.");
    window.location.assign("/admin/options");
  }

  return (
    <main className="adminAuth">
      <form onSubmit={submit}>
        <p className="eyebrow dark">KWAKO NYUMBANI</p>
        <h1>Administration des options</h1>
        <label>Identifiant<input name="username" autoComplete="username" required /></label>
        <label>Mot de passe<input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p className="adminError" role="alert">{error}</p>}
        <button disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
      </form>
    </main>
  );
}

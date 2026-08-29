# Kwako Nyumbani

Application Vinext/Vite utilisant Drizzle ORM et SQLite local avec
`better-sqlite3`.

## Prerequisites

- Node.js `>=22.13.0`
- Linux pour la production
- Un chemin absolu et persistant pour `DATABASE_PATH` en production

## Base SQLite

En développement, la base par défaut est `data/database.sqlite`. En production,
`DATABASE_PATH` est obligatoire, doit être absolu et doit viser un volume
persistant. Le processus refuse de démarrer sans cette variable afin de ne pas
créer silencieusement une base vide dans un autre dossier.

Initialisation locale :

```bash
npm ci
npm run db:migrate
npm run dev
```

Installation VPS (exemple) :

```bash
sudo install -d -o www-data -g www-data -m 750 /var/lib/kwako-nyumbani
npm ci
DATABASE_PATH=/var/lib/kwako-nyumbani/database.sqlite npm run db:migrate
npm run build
pm2 start ecosystem.config.cjs --env production
pm2 save
```

Les migrations sont suivies dans `drizzle/`. Après une modification volontaire
du schéma, lancer `npm run db:generate`, relire le SQL généré, puis
`npm run db:migrate`.

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Commandes

- `npm run dev` : serveur de développement
- `npm run db:migrate` : crée/met à niveau la base de façon reproductible
- `npm run db:generate` : génère une migration après changement du schéma
- `npm run build` : build de production
- `npm run start` : serveur Node.js de production
- `npm run typecheck` : vérification TypeScript

## Développement local des prix d’options

Cette fonctionnalité est isolée sur la branche `feature/admin-options`. Copier
`.env.example` vers `.env.local`, choisir un chemin SQLite réservé au
développement et remplacer les trois valeurs d’authentification. Ne jamais
utiliser le chemin de la base VPS pour ces tests.

```bash
npm ci
npm run db:migrate
npm run dev
```

Le back-office est disponible sur `/admin/options`. Les identifiants restent
uniquement dans `.env.local`; la session est stockée dans un cookie signé,
`HttpOnly`, `SameSite=Strict`, valable huit heures.

## Learn More

- [Vinext](https://github.com/cloudflare/vinext)
- [Drizzle SQLite](https://orm.drizzle.team/docs/get-started/better-sqlite3-new)

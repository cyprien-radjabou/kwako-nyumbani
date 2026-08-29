import {
  createAdminSession,
  sessionCookie,
  validateAdminCredentials,
} from "../../../admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!validateAdminCredentials(username, password)) {
      return Response.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const response = Response.json({ ok: true });
    const cookie = sessionCookie(createAdminSession());
    response.headers.append(
      "set-cookie",
      `${cookie.name}=${cookie.value}; Path=${cookie.path}; Max-Age=${cookie.maxAge}; HttpOnly; SameSite=Strict${cookie.secure ? "; Secure" : ""}`,
    );
    return response;
  } catch (error) {
    console.error("ERREUR CONNEXION ADMIN :", error);
    return Response.json({ error: "Connexion momentanément indisponible." }, { status: 500 });
  }
}

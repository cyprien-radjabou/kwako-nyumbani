import { expiredSessionCookie } from "../../../admin-auth";

export async function POST() {
  const cookie = expiredSessionCookie();
  const response = Response.json({ ok: true });
  response.headers.append(
    "set-cookie",
    `${cookie.name}=; Path=${cookie.path}; Max-Age=0; HttpOnly; SameSite=Strict${cookie.secure ? "; Secure" : ""}`,
  );
  return response;
}

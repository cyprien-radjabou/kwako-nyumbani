import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { reservations } from "../../../../db/schema";

const allowedStatuses = new Set([
  "received", "review", "approved", "construction", "delivered", "rejected",
]);

export async function GET() {
  try {
    if (!(await getChatGPTUser())) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }

    const rows = await getDb()
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt))
      .limit(500);

    return Response.json({ reservations: rows });
  } catch (error) {
    console.error("ERREUR LISTE RESERVATIONS ADMIN :", error);
    return Response.json(
      { error: "Le service est momentanément indisponible." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await getChatGPTUser())) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }

    const p = (await request.json()) as { id?: unknown; status?: unknown };
    const id = Number(p.id);
    const status = typeof p.status === "string" ? p.status : "";

    if (!Number.isSafeInteger(id) || id <= 0 || !allowedStatuses.has(status)) {
      return Response.json({ error: "Données invalides" }, { status: 400 });
    }

    const result = await getDb()
      .update(reservations)
      .set({ status, updatedAt: new Date() })
      .where(eq(reservations.id, id));

    if (result.changes === 0) {
      return Response.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("ERREUR MISE A JOUR RESERVATION ADMIN :", error);
    return Response.json(
      { error: "Le service est momentanément indisponible." },
      { status: 500 },
    );
  }
}

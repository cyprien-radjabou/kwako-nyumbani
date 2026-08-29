import { asc, eq } from "drizzle-orm";

import { isAdminRequest } from "../../../admin-auth";
import { getDb } from "../../../../db";
import { optionPrices } from "../../../../db/schema";

export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }
    const options = await getDb().select().from(optionPrices).orderBy(asc(optionPrices.sortOrder));
    return Response.json({ options });
  } catch (error) {
    console.error("ERREUR LISTE PRIX OPTIONS ADMIN :", error);
    return Response.json({ error: "Le service est momentanément indisponible." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = (await request.json()) as { key?: unknown; price?: unknown };
    const key = typeof body.key === "string" ? body.key : "";
    const price = Number(body.price);
    if (!key || !Number.isSafeInteger(price) || price < 0 || price > 100_000_000) {
      return Response.json({ error: "Prix invalide." }, { status: 400 });
    }
    const result = await getDb()
      .update(optionPrices)
      .set({ price, updatedAt: new Date() })
      .where(eq(optionPrices.key, key));
    if (result.changes === 0) {
      return Response.json({ error: "Option introuvable." }, { status: 404 });
    }
    return Response.json({ ok: true, price });
  } catch (error) {
    console.error("ERREUR MISE A JOUR PRIX OPTION :", error);
    return Response.json({ error: "Le service est momentanément indisponible." }, { status: 500 });
  }
}

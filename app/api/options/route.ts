import { asc } from "drizzle-orm";

import { getDb } from "../../../db";
import { optionPrices } from "../../../db/schema";

export async function GET() {
  try {
    const options = await getDb()
      .select({ key: optionPrices.key, name: optionPrices.name, price: optionPrices.price })
      .from(optionPrices)
      .orderBy(asc(optionPrices.sortOrder));
    return Response.json({ options });
  } catch (error) {
    console.error("ERREUR PRIX OPTIONS PUBLIQUES :", error);
    return Response.json(
      { error: "Les options sont momentanément indisponibles." },
      { status: 500 },
    );
  }
}

import { and, eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { reservations } from "../../../db/schema";

const labels: Record<string, [string, number]> = {
  received: ["Demande reçue", 1],
  review: ["Dossier en vérification", 2],
  approved: ["Financement approuvé", 3],
  construction: ["Construction en cours", 4],
  delivered: ["Maison livrée", 4],
  rejected: ["Dossier à compléter", 1],
};

function clean(v: unknown, n = 160) {
  return typeof v === "string" ? v.trim().slice(0, n) : "";
}

export async function POST(request: Request) {
  try {
    const p = (await request.json()) as Record<string, unknown>;

    const name = clean(p.name, 120);
    const employeeId = clean(p.employeeId, 50);
    const phone = clean(p.phone, 40);
    const modelId = clean(p.modelId, 30);
    const modelName = clean(p.modelName, 50);

    if (!name || !employeeId || !phone || !modelId) {
      return Response.json(
        { error: "Veuillez compléter les champs obligatoires." },
        { status: 400 }
      );
    }

    const reference = `KWN-${new Date().getFullYear()}-${crypto
      .randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    const now = new Date();

    const db = await getDb();

    await db.insert(reservations).values({
      reference,
      name,
      employeeId,
      phone,
      email: clean(p.email, 160) || null,
      department: clean(p.department, 100) || null,
      plot: clean(p.plot, 50) || null,
      modelId,
      modelName,
      price: Number(p.price) || 0,
      years: [5, 10, 15].includes(Number(p.years))
        ? Number(p.years)
        : 15,
      options: JSON.stringify(
        Array.isArray(p.options) ? p.options.slice(0, 10) : []
      ),
      optionsTotal: Number(p.optionsTotal) || 0,
      monthly: Number(p.monthly) || 0,
      createdAt: now,
      updatedAt: now,
    });

    return Response.json({ reference }, { status: 201 });
  } catch (error) {
    console.error("ERREUR RESERVATION :", error);

    return Response.json(
      { error: "Le service est momentanément indisponible." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const u = new URL(request.url);

    const reference = clean(
      u.searchParams.get("reference"),
      30
    ).toUpperCase();

    const phone = clean(u.searchParams.get("phone"), 40);

    if (!reference || !phone) {
      return Response.json(
        { error: "Référence et téléphone requis." },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [r] = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.reference, reference),
          eq(reservations.phone, phone)
        )
      )
      .limit(1);

    if (!r) {
      return Response.json(
        { error: "Aucune demande ne correspond à ces informations." },
        { status: 404 }
      );
    }

    const [statusLabel, progress] =
      labels[r.status] || labels.received;

    return Response.json({
      reservation: {
        reference: r.reference,
        modelName: r.modelName,
        status: r.status,
        statusLabel,
        progress,
        updatedAt: r.updatedAt,
      },
    });
  } catch (error) {
    console.error("ERREUR SUIVI RESERVATION :", error);

    return Response.json(
      { error: "Le suivi est momentanément indisponible." },
      { status: 500 }
    );
  }
}
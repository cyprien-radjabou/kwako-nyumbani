import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";

import { getDb } from "../../../db";
import { optionPrices } from "../../../db/schema";
import { isAdminAuthenticated } from "../../admin-auth";
import OptionsAdmin from "./OptionsAdmin";

export const dynamic = "force-dynamic";

export default async function OptionsAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const options = await getDb().select().from(optionPrices).orderBy(asc(optionPrices.sortOrder));
  return <OptionsAdmin initialOptions={options.map((option) => ({ ...option, updatedAt: option.updatedAt.toISOString() }))} />;
}

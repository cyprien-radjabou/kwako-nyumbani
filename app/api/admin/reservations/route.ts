import { desc,eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { reservations } from "../../../../db/schema";
export async function GET(){if(!await getChatGPTUser())return Response.json({error:"Non autorisé"},{status:401});const rows=await (await getDb()).select().from(reservations).orderBy(desc(reservations.createdAt)).limit(500);return Response.json({reservations:rows})}
export async function PATCH(request:Request){if(!await getChatGPTUser())return Response.json({error:"Non autorisé"},{status:401});const p=await request.json() as {id?:number,status?:string};const allowed=['received','review','approved','construction','delivered','rejected'];if(!p.id||!p.status||!allowed.includes(p.status))return Response.json({error:'Données invalides'},{status:400});await (await getDb()).update(reservations).set({status:p.status,updatedAt:new Date()}).where(eq(reservations.id,p.id));return Response.json({ok:true})}

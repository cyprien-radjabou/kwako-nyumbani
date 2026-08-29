import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import AdminDashboard from "./AdminDashboard";
export const dynamic="force-dynamic";
export default async function AdminPage(){const user=await requireChatGPTUser("/admin");return <AdminDashboard user={user.displayName} signout={chatGPTSignOutPath("/")}/>}

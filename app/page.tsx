import GameQuizApp from "./GameQuizApp";
import { chatGPTSignOutPath } from "./chatgpt-auth";
import { getCurrentUser } from "./current-user";
export const dynamic="force-dynamic";
export default async function Home(){const user=await getCurrentUser();return <GameQuizApp user={user?{displayName:user.displayName,email:user.email}:null} signOutHref={chatGPTSignOutPath("/")} firebaseUser={user?.provider==="firebase"} anonymousUser={user?.anonymous}/>}

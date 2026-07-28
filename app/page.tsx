import GameQuizApp from "./GameQuizApp";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "./chatgpt-auth";

export const dynamic="force-dynamic";

export default async function Home(){
  const user=await getChatGPTUser();
  return <GameQuizApp
    user={user?{displayName:user.displayName,email:user.email}:null}
    signInHref={chatGPTSignInPath("/")}
    signOutHref={chatGPTSignOutPath("/")}
  />;
}

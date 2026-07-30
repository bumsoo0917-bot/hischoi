import GameQuizApp from "./GameQuizApp";
import LoginScreen from "./LoginScreen";
import { chatGPTSignOutPath } from "./chatgpt-auth";
import { getCurrentUser } from "./current-user";

export const dynamic="force-dynamic";

export default async function Home(){
  const user=await getCurrentUser();
  if(!user)return <LoginScreen/>;

  return <GameQuizApp
    user={{displayName:user.displayName,email:user.email}}
    signOutHref={chatGPTSignOutPath("/")}
    firebaseUser={user.provider==="firebase"}
    anonymousUser={user.anonymous}
  />;
}

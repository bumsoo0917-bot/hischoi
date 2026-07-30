import { redirect } from "next/navigation";
import { getCurrentUser } from "../current-user";
import EraVisualQuiz from "./EraVisualQuiz";

export const dynamic="force-dynamic";

export default async function EraVisualQuizPage(){
  const user=await getCurrentUser();
  if(!user)redirect("/");
  return <EraVisualQuiz/>;
}

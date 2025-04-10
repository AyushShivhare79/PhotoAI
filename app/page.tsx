import { getServerSession } from "next-auth";
import Login from "../components/home/Login";
import authOptions from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Login />
    </>
  );
}

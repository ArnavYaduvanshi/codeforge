
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getUserById = async (id:string)=>{
    try {
        const user = await db.user.findUnique({
            where:{id},
            include:{accounts:true}
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}


export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

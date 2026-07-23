"use server"
import { currentUser } from "@/features/auth/actions/current-user";
import { db } from "@/lib/db"
export const getAllPlaygroundForUser = async ()=>{
    const user = await currentUser();
    try {
        const user  = await currentUser();
        const playground = await db.playground.findMany({
            where:{
                userId:user?.id!
            },
            include:{
                user:true,
                Starmark:{
                    where:{
                        userId:user?.id!
                    },
                    select:{
                        isMarked:true
                    }
                }
            }
        })
      
        return playground;
    } catch (error) {
        console.log(error)
    }
}
"use server"
import { currentUser } from "@/features/auth/actions/current-user";
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache";
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
export const createPlayground = async (data:{
    title:string,
    template:"REACT"|"NEXTJS"|"VUE"|"ANGULAR"|"HONO"|"EXPRESS";
    description?:string;

})=>{
    const user = await currentUser();
    const {template,description,title} = data;
    try {
        const playground = await db.playground.create({
            data:{
                title:title,
                template:template,
                description:description,
                userId:user?.id!
            }
        })
        return playground;
    } catch (error) {
        console.log(error)
    }
}
 export const deleteProjectById = async (id:string)=>{
    try {
        const playground = await db.playground.delete({
            where:{
                id:id
            }
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.log(error)
    }
}
export const editProjectById = async (id:string, data:{title:string,description?:string})=>{
    try {
        const playground = await db.playground.update({
            where:{
                id:id
            },
            data:data
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.log(error)
    }
}

export const duplicateProjectById = async (id:string)=>{
    try {
        const playground = await db.playground.findUnique({
            where:{
                id:id
            }
        })
        if(!playground){
            throw new Error("Project not found")
        }
        const duplicatedPlayground = await db.playground.create({
            data:{
                title:`${playground.title} (Copy)`,
                template:playground.template,
                description:playground.description,
                userId:playground.userId
            }
        })
        revalidatePath("/dashboard")
        return duplicatedPlayground;
    } catch (error) {
        console.log(error)
    }
}
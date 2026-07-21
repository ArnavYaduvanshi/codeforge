// Plain server-side helpers (not Server Actions - nothing here is invoked
// directly from a client component/form, it's only ever called from the
// jwt() callback in auth.ts). Deliberately no "use server" directive: that
// would register these as callable Server Action endpoints, which they
// aren't meant to be, and previously this file also imported `auth` from
// "@/auth" for the currentUser() helper below - since auth.ts imports THIS
// file for getUserById/getAccountByUserId, that created a circular import
// between auth.ts and features/auth/actions. currentUser() now lives in
// ./current-user.ts instead, so this file has no dependency back on auth.ts.

import { db } from "@/lib/db";


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


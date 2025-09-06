"use server"

import prisma from "@/lib/prisma";
import { editEmergecyContactInfoSchema, editUserInfoSchema } from "@/lib/validation";
import bcrypt from "bcrypt";

async function checkEmail(userId:string, email:string){
    const result = await prisma.userInfo.findFirst({
        where:{
            NOT:{
                userId:userId
            },
            email:email
        }
    })
    if(result){
        //if i can find someone, then the email is not valid
        return false
    }else{
        return true
    }
}

export async function editUserInfo(FormData:any, userId:string, variant:string){
    switch (variant){
        case "user":
            const validUser = editUserInfoSchema.safeParse(FormData);
            if (!validUser.success) {
                return { error: "Invalid account editing" };
            }
            
            const validEmail = await checkEmail(userId, FormData.email)
            if(!validEmail){
                return {error: "Email is already taken"}
            }

            try{
                FormData.existingConditions = JSON.stringify(FormData.existingConditions)
                await prisma.userInfo.update({
                where:{
                    userId: userId
                },
                data: FormData
                })
            return true;
            }catch(error){
                console.log(error)
            }
            break;
            
        case "password":
            if(!checkPassword(userId, FormData.currentPassword)){
                return;
            }
            const hashedPassword = await bcrypt.hash(FormData.password, 10);
            await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    password:hashedPassword
                }
            }) 
            break;
        case "emergencyContact":
            const validEmergencyContact = editEmergecyContactInfoSchema.safeParse(FormData);
            if (!validEmergencyContact.success) {
                return { error: "Invalid account editing" };
            }
            try{
                await prisma.userEmergencyContact.update({
                where:{
                    userId: userId
                },
                data: FormData
                })
            return true;
            }catch(error){
                console.log(error)
            }
            break;
    }
    
    return true;
}


export async function checkPassword(userId, currentPassword){
    //get old password
    const userPassword = await prisma.user.findFirst({
        where:{
            id:userId,
        },
        select:{
            password:true
        }
    })
    await prisma.$disconnect()

    const passwordValid = await bcrypt.compare(currentPassword,userPassword.password)

    if(passwordValid){
        return true
    }else{
        return false
    }
}

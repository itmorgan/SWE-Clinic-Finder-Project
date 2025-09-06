"use server"


import { sendClinicAppointmentCancelEmail } from "@/lib/mail";
import { PrismaClient, Appointment } from "@prisma/client";
import { format } from 'date-fns';
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function acceptAppointment (
    appointmentId: string,
): Promise<void>{

 try {
    await prisma.appointment.update({
        where: {
            id: appointmentId,
        },
        data: {
            appointmentStatus: {
                update: {
                    status: "Approved",
                },
            },
        },
    });
    } catch (error) {
        console.error('Error accepting appointment:', error);
        throw new Error ('Failed to accept appointment');
    }
    redirect("/clinic/schedule");
}

export async function rejectAppointment (
    appointmentId: string,
    rejectRemarks: string,
): Promise<void>{

 try {
    await prisma.appointment.update({
        where: {
            id: appointmentId,
        },
        data: {
            appointmentStatus: {
                update: {
                    status: "Rejected",
                    remarks: rejectRemarks,
                },
            },
        },
    });
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        throw new Error ('Failed to reject appointment');
    }
    
    //for sending email
    await prisma.appointment.findFirst({
        select:{
            healthFacilityId:true,
            appointmentStart:true,
        },
        where:{
            id:appointmentId,
        }
    }).then(async(appointment)=>{
        await prisma.healthFacilityInfo.findFirst({
            where:{
                healthFacilityId:appointment.healthFacilityId,
            },
        }).then(async(healthFacilityInfo)=>{
            await sendClinicAppointmentCancelEmail(healthFacilityInfo,appointment.appointmentStart,rejectRemarks)
        })
    })



    redirect("/clinic/schedule");
}
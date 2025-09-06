"use server";

import { sendUserAppointmentCancelEmail } from "@/lib/mail";
import { Appointment } from "@prisma/client";
import { redirect } from "next/navigation";

export async function deleteAppointment(appointment:Appointment) {
  const userId = appointment.userId;
  await prisma.appointment.delete({
    where: {
      id: appointment.id,
    },
  });

  await prisma.healthFacilityInfo.findFirst({
    select:{
      email:true,
    },
    where:{
      healthFacilityId:appointment.healthFacilityId
    }
  }).then(async(healthFacilityInfo)=>{
    await sendUserAppointmentCancelEmail(healthFacilityInfo.email,appointment.userId,appointment.appointmentStart)
})



  redirect(`/profile/${userId}/appointment`);
}

import { HealthFacilityInfo } from "@prisma/client";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  //   const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  //   await resend.emails.send({
  //     from: "mail@auth-masterclass-tutorial.com",
  //     to: email,
  //     subject: "Confirm your email",
  //     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  //   });

  const confirmLink = `${domain}/verification?token=${token}`;

  await resend.emails.send({
    from: "no-reply@drwhere.org",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendUserAppointmentCancelEmail = async(email:string, patientUserId:string, date:Date) => {
  await resend.emails.send({
    from:"no-reply@drwhere.org",
    to:email,
    subject: "Appointment Cancelled by Patient",
    html: `<div>
            <div> Patient has cancelled appointment.</div>
            <div> Patient ID: ${patientUserId}</div>
            <div> Appointment Slot: ${date}</div>
          </div>`
  });
}

export const sendClinicAppointmentCancelEmail = async(clinicInfo:HealthFacilityInfo, date:Date, reason:string) => {
  await resend.emails.send({
    from: "no-reply@drwhere.org",
    to: clinicInfo.email,
    subject: "Appointment Cancelled by Clinic",
    html: `<div>
            <div> Clinic has cancelled appointment.</div>
            <div> Clinic Name: ${clinicInfo.name}</div>
            <div> Appointment Slot: ${date}</div>
            <div> Reason: ${reason}
          </div>`
  });
}
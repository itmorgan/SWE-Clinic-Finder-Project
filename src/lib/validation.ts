/**
 * @file This file contains validation schemas for creating feedback and creating an account.
 * @module validation
 */
/**
 * This file contains validation schemas for creating feedback and creating an account.
 */

import { Regex } from "lucide-react";
import { z } from "zod";

/**
 * Enum representing different roles.
 */
export enum Role {
  User = "User",
  HealthFacility = "HealthFacility",
}

export enum Salutation {
  Mr = "Mr",
  Mrs = "Mrs",
  Ms = "Ms",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

enum Status {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

enum Priority {
  Low = "Low",
  High = "High",
}

/**
 * Schema for a required string.
 */
const requiredString = z.string().min(1, "Required");

/**
 * Schema for validating feedback image.
 */
const feedbackImageSchema = z
  .custom<File | undefined>()
  .refine((file) => {
    !file || (file instanceof File && file.type.startsWith("image/"));
  }, "Must be an image file")
  .refine((file) => {
    return !file || file.size < 2 * 1024 * 1024;
  }, "File size must be less than 2MB");

/**
 * Schema for validating feedback feature.
 */
const feedbackFeatureSchema = z
  .object({
    feature: z.string().optional(),
    description: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      // Ensure either both fields are filled or none are filled
      const hasField1 = data.feature !== undefined && data.feature !== "";
      const hasField2 =
        data.description !== undefined && data.description !== "";

      return (hasField1 && hasField2) || (!hasField1 && !hasField2);
    },
    {
      message: "Feature and description are required",
      path: ["feature"],
    },
  );

/**
 * Schema for creating feedback.
 */
export const createFeedbackSchema = z
  .object({
    ratings: z.string(),
    problemFaced: requiredString.max(500).optional(),
    suggestion: requiredString.max(500).optional(),
  })
  .and(feedbackFeatureSchema);

/**
 * Type representing the values for creating feedback.
 */
export type CreateFeedbackValues = z.infer<typeof createFeedbackSchema>;

/**
 * Schema for checking password.
 */
const accountPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .and(accountPasswordSchema);

export type EditPasswordValues = z.infer<typeof editPasswordSchema>;

const userSchemaFragment = z.object({
  salutation: z.string(),
  firstName: requiredString.max(500),
  lastName: requiredString.max(500),
  existingMedicalCondition: z.string().array().optional(),
  gender: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^(9|8)\d{7}$/, "Invalid phone number"),
  address: z.string().max(500),
  postalCode: z.string().regex(/^\d{6}$/, "Invalid postal code"),
  dateOfBirth: z.date(),
});

const userEmergencyContactSchema = z.object({
  ecSalutation: z.string(),
  ecFirstName: requiredString.max(500),
  ecLastName: requiredString.max(500),
  ecGender: z.string(),
  ecRelationship: z.string(),
  ecPhoneNumber: z.string().regex(/^(9|8)\d{7}$/, "Invalid phone number"),
  ecPostalCode: z.string().regex(/^\d{6}$/, "Invalid postal code"),
  ecAddress: z.string().max(500),
});

const healthFacilityDoctorSchema = z.object({
  doctorFirstName: requiredString.max(500),
  doctorLastName: requiredString.max(500),
  doctorPhoneNumber: z.string().regex(/^(9|8|6)\d{7}$/, "Invalid phone number"),
  doctorAddress: requiredString.max(500),
  doctorGender: requiredString,
  doctorSalutation: requiredString,
});

const healthFacilitySchemaFragment = z.object({
  facilityName: z.string().max(500),
  facilityAddress: z.string().max(500),
  facilityPostalCode: z.string().regex(/^\d{6}$/, "Invalid postal code"),
  facilityPhoneNumber: z
    .string()
    .regex(/^(9|8|6)\d{7}$/, "Invalid phone number"),
  facilityEmail: z.string().email(),
  facilityWebsite: z.string().url().optional(),
  facilityStreetName: z.string().max(500).optional(),
  facilityBuildingName: z.string().max(500).optional(),
  facilityBlockNumber: z.string().max(500).optional(),
  facilityFloorNumber: z.string().max(500).optional(),
  facilityUnitNumber: z.string().max(500).optional(),
  facilityDoctors: healthFacilityDoctorSchema
    .array()
    .min(1, "Doctor is required"),
});

/**
 * Schema for creating an user account.
 */
export const createUserAccountSchema = z
  .object({
    username: z.string().min(5, "Required"),
    //role: z.string(),
  })
  .and(accountPasswordSchema)
  .and(userSchemaFragment)
  .and(userEmergencyContactSchema);

export const createHealthFacilityAccountSchema = z
  .object({
    username: z.string().min(5, "Required"),
    // role: z.string(),
  })
  .and(healthFacilitySchemaFragment)
  .and(accountPasswordSchema);

/**
 * Type representing the values for creating an account.
 */
export type CreateUserAccountValues = z.infer<typeof createUserAccountSchema>;
export type CreateHealthFacilityAccountValues = z.infer<
  typeof createHealthFacilityAccountSchema
>;

/**
 * Schema for clinic filtering.
 */

export const clinicFilterSchema = z.object({
  q: z.string().optional(),
  programType: z.string().optional(),
  address: z.string().optional(),
  symptoms: z.string().array().optional(),
  gender: z.string().optional(),
  yob: z.string().optional(),
  message: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  page: z.string().optional(),
});

export type ClinicFilterValues = z.infer<typeof clinicFilterSchema>;

export const UserInfoFormDataSchema = z.object({
  gender: z.string().min(1, "Gender is required"),
  age: z.string().min(1, "Age is required"),
  symptoms: z.string().min(1, "Symptoms is required"),
});

/**
 * Schema for user scheduling appointmnet.
 */

export const scheduleAppointmentSchema = z.object({
  appointmentDate: z.date(),
  appointmentTime: z.string(),
  symptoms: z.string().array().min(1, "Symptoms is required"),
});

export type CreateScheduleAppointmentValues = z.infer<
  typeof scheduleAppointmentSchema
>;

/**
 *  Schema for editing user profile
 * */

const editSalutationSchema = z.object({
  salutation: z.string(),
});

const editNameSchema = z.object({
  firstname: requiredString.max(500),
  lastname: requiredString.max(500),
});

const editExistingConditionsSchema = z.object({
  existingConditions: z.string().array().optional(),
});

const editGenderSchema = z.object({
  gender: z.string().min(1, "Required"),
});

const editEmailSchema = z.object({
  email: z.string().email(),
});

const editPhoneNumberSchema = z.object({
  phoneNumber: z.string().regex(/^(9|8)\d{7}$/, "Invalid phone number"),
});

const editAddressSchema = z.object({
  address: z.string().max(500).min(1, "Required"),
});

const editPostalCodeSchema = z.object({
  postalCode: z.string().regex(/^\d{6}$/, "Invalid postal code"),
});

const editDateOfBirthSchema = z.object({
  dateOfBirth: z.date(),
});
const editRelationshipSchema = z.object({
  relationship: z.string().min(1, "Required"),
});

export const editUserInfoSchema = z
  .object({})
  .and(editNameSchema)
  .and(editGenderSchema)
  .and(editSalutationSchema)
  .and(editEmailSchema)
  .and(editDateOfBirthSchema)
  .and(editExistingConditionsSchema)
  .and(editPhoneNumberSchema)
  .and(editAddressSchema)
  .and(editPostalCodeSchema);

export type EditUserInfoValues = z.infer<typeof editUserInfoSchema>;

export const editEmergecyContactInfoSchema = z
  .object({})
  .and(editNameSchema)
  .and(editGenderSchema)
  .and(editSalutationSchema)
  .and(editPhoneNumberSchema)
  .and(editAddressSchema)
  .and(editPostalCodeSchema)
  .and(editRelationshipSchema);

export type EditEmergecyContactInfoValues = z.infer<
  typeof editEmergecyContactInfoSchema
>;

export const PatientSymptoms = z.object({
  symptoms: z.string().min(1, "Symptoms is required"),
});

export const PatientConditions = z.object({
  conditions: z.string().min(1, "Choose at least one condition"),
});

/**
 *  Schema for log in
 * */

export const loginSchema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
});

export type CreateLoginValues = z.infer<typeof loginSchema>;

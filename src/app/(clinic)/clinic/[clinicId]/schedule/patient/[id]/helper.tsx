"use client";
import symptomsList from "@/lib/symptoms-list";
import {
  Appointment,
  Gender,
  HealthFacilityInfo,
  Status,
} from "@prisma/client";
import { UserInfo, UserEmergencyContact } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { H2, H3, H4 } from "@/components/ui/hTags";
import { Separator } from "@/components/ui/separator";

interface UserInfoPanelProps {
  userInfo: UserInfo;
  emergencyContactInfo: UserEmergencyContact;
  upcomingAppointmentInfos: Appointment[];
  pastAppointmentInfos: Appointment[];
  pastHealthFacilityInfos: HealthFacilityInfo[];
  upcomingHealthFacilityInfos: HealthFacilityInfo[];
}

interface UserInfoLeftPanelProps {
  userInfo: UserInfo;
  emergencyContactInfo: UserEmergencyContact;
}

interface UserInfoRightPanelProps {
  userInfo: UserInfo;
  upcomingAppointmentInfos: Appointment[];
  pastAppointmentInfos: Appointment[];
  pastHealthFacilityInfos: HealthFacilityInfo[];
  upcomingHealthFacilityInfos: HealthFacilityInfo[];
}

interface userInfoFragmentProps {
  title: string;
  info: string;
  variant?: "normal" | "name" | "carousel" | "proper";
}

interface ConditionCardProps {
  condition: string;
  variant?: "cardLeft" | "cardCenter";
}

interface ConditionProps {
  conditions: JsonValue;
  variant?: "cardLeft" | "cardCenter" | "carousel" | "proper";
}

interface AppointmentCardProps {
  appointment: Appointment;
  healthFacilityInfo: HealthFacilityInfo;
}

function shuffleColour(colour: string) {
  shuffledColour.push(...colourList);
  for (let i = 0; i < shuffledColour.length; i++) {
    let j = Math.floor(Math.random() * shuffledColour.length);
    [shuffledColour[i], shuffledColour[j]] = [
      shuffledColour[j],
      shuffledColour[i],
    ];
  }

  if (shuffledColour[0] == colour) {
    let j = Math.floor(Math.random() * (shuffledColour.length - 1)) + 1;
    [shuffledColour[0], shuffledColour[j]] = [
      shuffledColour[j],
      shuffledColour[0],
    ];
  }
}

function getRandomColour() {
  let colour = shuffledColour[0];
  shuffledColour.splice(0, 1);
  if (shuffledColour.length == 0) {
    shuffleColour(colour);
  }
  return colour;
}

const colourList: string[] = [
  "bg-[#fde7e5]",
  "bg-[#f4ebff]",
  "bg-[#ddf1ff]",
  "bg-[#eafff1]",
  "bg-[#fdf3e7]",
  "bg-[#d4eff1]",
];
const shuffledColour: string[] = [];
shuffledColour.push(...colourList);

function translateSymptomId(symptomId: string) {
  for (const symptom of symptomsList) {
    if (symptom.ID === Number(symptomId)) {
      return symptom.Name;
    }
  }
  return null;
}

export function getSymptoms(symptoms: JsonValue) {
  const a = JSON.stringify(symptoms);
  const regex = /\d+/g;
  const matches = a.match(regex);
  const existingConditions: string[] = [];
  if (matches) {
    matches.forEach((symptom) => {
      existingConditions.push(translateSymptomId(symptom));
    });
  }
  return existingConditions;
}

export const UserInfoFragment: React.FC<userInfoFragmentProps> = ({
  title,
  info,
  variant = "normal",
}) => {
  const variantOutput = () => {
    switch (variant) {
      case "name":
        return (
          <div className="flex flex-col">
            <H2>{title}</H2>
            <H4>{info}</H4>
          </div>
        );
      case "normal":
      default:
        return (
          <div className="flex flex-col pt-5">
            <H3>{title}</H3>
            <H4>{info}</H4>
          </div>
        );
    }
  };
  return variantOutput();
};

export const ConditionsCard: React.FC<ConditionCardProps> = ({
  condition,
  variant,
}) => {
  const colour = getRandomColour();
  return (
    <Card className={`${colour} mb-2 ml-3 text-black`}>
      <CardHeader className="p-2">
        <CardTitle className=" md:text-md text-nowrap text-xs sm:text-sm lg:text-lg">
          {condition}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export const Conditions: React.FC<ConditionProps> = ({
  conditions,
  variant,
}) => {
  const translatedConditions = getSymptoms(conditions);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredConditions = translatedConditions.filter((condition) =>
    condition.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (translatedConditions.length > 0) {
    return (
      <div className="flex w-full flex-col space-y-3">
        <div className="w-85% flex items-center justify-between">
          <H2>Pre-existing Conditions</H2>
          <Input
            type="search"
            id="search"
            placeholder="Search"
            className="w-[6.5rem] sm:w-[7.5rem] md:w-[9.5rem] lg:w-[11.5rem]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-85% border-colour-[#e2e8f0] flex max-h-[30vh] flex-wrap overflow-auto rounded-2xl border-2 py-3">
          {filteredConditions.map((condition, index) => (
            <ConditionsCard key={index} condition={condition} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-col space-y-3">
        <div className="w-85% ml-3 flex items-center justify-between">
          <div>Pre-existing Conditions</div>
          <Input
            type="search"
            id="search"
            placeholder="Search"
            className="w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-85% flex text-center">
          <>None</>
        </div>
      </div>
    );
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  healthFacilityInfo,
}) => {
  const colour = getRandomColour();
  const day: string = String(appointment.appointmentStart.getDay());
  const month: string = String(appointment.appointmentStart.getMonth());
  const year: string = String(appointment.appointmentStart.getFullYear()).slice(
    -2,
  );
  const date: string = day.concat("/", month, "/", year);
  const symptoms = getSymptoms(appointment.symptoms);

  return (
    <div className={`${colour} flex w-[35%] flex-col rounded-md p-[1.5vw] border`}>
      <div className="text-[1.1vw] font-bold text-black">{date}</div>
      <div className="text-[1.5vw] font-semibold text-black">
        {healthFacilityInfo.name}
      </div>{" "}
      {/*Theres no doctor info in appointment, so im using clinic name*/}
      <div className="mt-[3vh] text-[1.5vw] font-bold text-black">Symptoms</div>
      {symptoms.length > 0 ? (
        symptoms.map((symptom, index) => (
          <div key={index} className="text-[1.2vw] text-black">
            {symptom}
          </div>
        ))
      ) : (
        <div className="text-[1vw]">None</div>
      )}
    </div>
  );
};

export const UserInfoLeftPanel: React.FC<UserInfoLeftPanelProps> = ({
  userInfo,
  emergencyContactInfo,
}) => {
  const userName = userInfo.firstname.concat(" ", userInfo.lastname.at(0), ".");
  const emergencyName = emergencyContactInfo.firstname.concat(
    " ",
    emergencyContactInfo.lastname.at(0),
    ".",
  );

  return (
    <div className="flex w-[40%] flex-col border-r-[2px] border-gray-200 sm:w-[45%] md:w-[45%] lg:w-[45%]">
      <div className="flex justify-center">
        <div className="mt-5 rounded-2xl border px-10 py-2 text-center">
          <UserInfoFragment
            title={userName}
            info={userInfo.phoneNumber}
            variant="name"
          />
        </div>
      </div>
      <div className="p-[1.5vw]">
        <div className="flex justify-between">
          <div className="flex w-[45%] flex-col space-y-5">
            <UserInfoFragment
              title={"Age"}
              info={String(
                new Date(Date.now()).getFullYear() -
                  userInfo.dateOfBirth.getFullYear(),
              )}
            />
            <UserInfoFragment
              title={"Date of Birth"}
              info={String(userInfo.dateOfBirth.getFullYear())}
            />
          </div>
          <div className="flex w-[50%] flex-col space-y-5 pl-[5%]">
            <UserInfoFragment title={"Gender"} info={String(userInfo.gender)} />
            <UserInfoFragment title={"PatientID"} info={userInfo.userId} />
          </div>
        </div>

        <UserInfoFragment title={"Address"} info={userInfo.address} />
        <Separator className="my-3" />
        <H3>Emergency Contact</H3>

        <div>
          <div className="flex justify-between">
            <div className="flex w-[50%] flex-col space-y-5">
              <UserInfoFragment title={"Name"} info={emergencyName} />
            </div>
            <div className="flex w-[50%] flex-col space-y-5">
              <UserInfoFragment
                title={"Relationship"}
                info={emergencyContactInfo.relationship}
              />
            </div>
          </div>
        </div>

        <UserInfoFragment
          title={"Phone Number"}
          info={emergencyContactInfo.phoneNumber}
        />
        <UserInfoFragment
          title={"Address"}
          info={emergencyContactInfo.address}
        />
      </div>
    </div>
  );
};
export const UserInfoRightPanel: React.FC<UserInfoRightPanelProps> = ({
  userInfo,
  pastAppointmentInfos,
  upcomingAppointmentInfos,
  pastHealthFacilityInfos,
  upcomingHealthFacilityInfos,
}) => {
  return (
    <div className="flex w-[55%] flex-col">
      <div className="px-4 py-10">
        <Conditions
          conditions={userInfo.existingConditions}
          variant={"cardLeft"}
        />
        <Separator className="my-3" />
        <H2>Past Appointments</H2>

        <div className="flex overflow-auto pt-2">
          <div className="flex w-full space-x-5">
            {pastAppointmentInfos.length > 0 ? (
              pastAppointmentInfos.map((appointment, index) => (
                <AppointmentCard
                  key={index}
                  appointment={appointment}
                  healthFacilityInfo={pastHealthFacilityInfos[index]}
                />
              ))
            ) : (
              <H4>None</H4>
            )}
          </div>
        </div>

        <Separator className="my-3" />
        <H2>Upcoming Appointments</H2>

        <div className="flex overflow-auto pt-2">
          <div className="flex w-full space-x-5">
            {upcomingAppointmentInfos.length > 0 ? (
              upcomingAppointmentInfos.map((appointment, index) => (
                <AppointmentCard
                  key={index}
                  appointment={appointment}
                  healthFacilityInfo={upcomingHealthFacilityInfos[index]}
                />
              ))
            ) : (
              <H4>None</H4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserInfoPanel: React.FC<UserInfoPanelProps> = (
  userInfoPanelProps,
) => {
  return (
    <div className="flex justify-center py-5">
      <div className="flex h-full w-[95%] rounded-xl border-[2px] border-gray-200">
        <UserInfoLeftPanel
          userInfo={userInfoPanelProps.userInfo}
          emergencyContactInfo={userInfoPanelProps.emergencyContactInfo}
        />
        <UserInfoRightPanel
          userInfo={userInfoPanelProps.userInfo}
          pastAppointmentInfos={userInfoPanelProps.pastAppointmentInfos}
          pastHealthFacilityInfos={userInfoPanelProps.pastHealthFacilityInfos}
          upcomingAppointmentInfos={userInfoPanelProps.upcomingAppointmentInfos}
          upcomingHealthFacilityInfos={
            userInfoPanelProps.upcomingHealthFacilityInfos
          }
        />
      </div>
    </div>
  );
};

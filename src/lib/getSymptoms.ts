import { JsonValue } from "@prisma/client/runtime/library";
import symptomsList from "./symptoms-list";

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
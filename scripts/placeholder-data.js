import {nanoid} from "nanoid";

const features = ["Symptom Checker", "Clinic Locator", "Addtional Information"];
const roles = ['Users', 'HealthFacility'];

const Role = {
    User: 'User',
    HealthFacility: 'HealthFacility',
}

export const placeholderFeedbacks = [
  {
    userId: nanoid(),
    ratings: Math.floor(Math.random() * 5),
    feature: features[Math.floor(Math.random() * 2)],
    description: "I love this feature",
    problemFaced: nanoid(),
    suggestion: "Add a map to the clinic locator",
    role: Role.User,
  },
  {
    userId: nanoid(),
    ratings: Math.floor(Math.random() * 5),
    feature: features[Math.floor(Math.random() * 2)],
    description: "I love this feature",
    problemFaced: nanoid(),
    suggestion: "Add a map to the clinic locator",
    role: Role.HealthFacility,
  },
  {
    userId: nanoid(),
    ratings: Math.floor(Math.random() * 5),
    feature: features[Math.floor(Math.random() * 2)],
    description: "I love this feature",
    problemFaced: nanoid(),
    suggestion: "Add a map to the clinic locator",
    role: Role.User,
  },
  {
    userId: nanoid(),
    ratings: Math.floor(Math.random() * 5),
    feature: features[Math.floor(Math.random() * 2)],
    description: "I love this feature",
    problemFaced: nanoid(),
    suggestion: "Add a map to the clinic locator",
    role: Role.HealthFacility,
  },
];

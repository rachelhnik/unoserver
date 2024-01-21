import { randomUUID } from "crypto";

export const generateUserId = (name: string) => {
  return name.substring(0, 2) + randomUUID().substring(0, 6);
};

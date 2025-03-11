import { Standard } from "./standard";

export interface Subject {
  _id: string;
  subject: string;
  isActive: boolean;
  standard?: Standard;
}

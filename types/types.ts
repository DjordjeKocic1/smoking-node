export interface ErrorMsg {
  statusCode: string | number;
  message: string;
}

export interface IUserBasicInfo {
  address: string;
  city: string;
  country: string;
  flag: string;
}

export interface IHealthInfo {
  bloodPressure: number;
  heartRhythm: number;
  COinBloodDecreases: number;
  lungCapacity: number;
  physicalAndBodilyStrength: number;
  riskofheartAttack: number;
  irritatingCough: number;
  stressTolerance: number;
  riskofLungeCancer: number;
  riskofThroatCancer: number;
  riskofKidneyCancer: number;
  riskofStroke: number;
  avgHealth: number;
}

export interface ISmokingInfo {
  isQuiting: boolean;
  dateOfQuiting: string;
  noSmokingDays: number;
}

export interface IConsumptionInfo {
  cigarettesDay: number;
  packCigarettesPrice: number;
  cigarettesInPack: number;
  cigarettesAvoided: number;
  cigarettesDailyCost: number;
  cigarettesMontlyCost: number;
  cigarettesYearlyCost: number;
  cigarettes5YearCost: number;
  cigarettes10YearCost: number;
  cigarettesAvoidedCost: number;
}
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  address: string;
  city: string;
  image: string;
  userVerified?: boolean;
  userBasicInfo?: IUserBasicInfo;
  healthInfo?: IHealthInfo;
  smokingInfo?: ISmokingInfo;
  consumptionInfo?: IConsumptionInfo | any;
  savedInfo?: IConsumptionInfo;
  calculateHealth?: any;
  calculateCosts?: any;
  categories?: [];
}

export interface IMentor {
  name:string;
  email: string;
  accepted: boolean;
  mentoringUser: IUser[];
}

export interface ITask {
  toDo: string;
  done: boolean;
  userId: string;
  mentorId: string;
}

export interface IConsumationPayload {
  cigarettesDay: number;
  cigarettesInPack: number;
  packCigarettesPrice: number;
  cigarettesAvoided: number;
}
export interface ICostsPayload {
  consumptionInfo: IConsumationPayload;
}

export interface IMentorPayload {
  name: string;
  email: string;
  accepted: boolean;
  user: IUser;
}

export interface ITaskPayload {
  toDo: string;
  done: boolean;
  userId: string;
  mentorId: string;
}

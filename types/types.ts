export interface ErrorMsg {
  statusCode: number;
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
  notificationToken: string;
  tasks: any;
}

export interface IMentor {
  _id?: string;
  name: string;
  email: string;
  accepted: boolean;
  mentorId: string;
  mentoringUserId: string;
  mentoringUser: IUser[];
}

export interface INotificaion {
  isMentoring: boolean;
  isAchievement: boolean;
  isTask: boolean;
  isRead: boolean;
  userId: string;
}

export interface ITask {
  toDo: string;
  status: string;
  comment: string;
  userId: string;
  mentorId: string;
}

export interface IAchievement {
  _id: any;
  name: string;
  description: string;
  categorie: string;
  points: string;
  type: string;
  tag: number;
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
  mentorId: string;
  accepted: boolean;
  user: IUser;
}

export interface ITaskPayload {
  toDo: string;
  status: string;
  comment: string;
  userId: string;
  mentorId: string;
}

export interface INotificaionMessage {
  to: string;
  title: string;
  body: string;
}

import { ObjectId, Types } from "mongoose";

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

export interface ICategorieUser {
  name: string;
  categorieId: string;
}
export interface ICategorie {
  name: string;
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
  _id: any;
  name: string;
  email: string;
  address: string;
  city: string;
  image: string;
  userVerified: boolean;
  userBasicInfo: IUserBasicInfo;
  healthInfo: IHealthInfo;
  smokingInfo: ISmokingInfo;
  consumptionInfo: IConsumptionInfo;
  savedInfo: IConsumptionInfo;
  calculateHealth: (user: IUser) => Promise<IUser>;
  calculateCosts: (user: IUser) => Promise<IUser>;
  toObject: Function;
  categories: ICategorie[];
  notificationToken: string;
  tasks: ITaskUser[];
  mentors: IMentor[];
  achievements: IAchievementUser[];
  gameScore: number;
  save: () => Promise<IUser>;
  subscriber: boolean;
  subscribeDate: string;
}

export interface IMentoringUser {
  _id?: string;
  userId: string;
  email: string;
  name: string;
}
export interface IMentor {
  _id: any;
  name: string;
  email: string;
  accepted: boolean;
  mentorId: string;
  mentoringUserId: string;
  mentoringUser: IMentoringUser[];
  save: () => Promise<IMentor>;
  _doc?: any;
  toObject: Function;
}

export interface INotificaion extends IUser {
  isMentoring: boolean;
  isAchievement: boolean;
  isTask: boolean;
  isRead: boolean;
  userId: string;
}

export interface ITask {
  _id: string;
  toDo: string;
  status: string;
  comment: string;
  userId: string;
  mentorId: string;
}

export interface ITaskUser {
  taskId: string;
  name: string;
}

export interface IAchievementUser {
  achievementId: string;
  name: string;
}

export interface IAchievement {
  _id: string;
  name: string;
  description: string;
  categorie: string;
  points: string;
  type: string;
  tag: number;
  _doc: any;
}

export interface IConsumationPayload extends IUser {
  cigarettesDay: number;
  cigarettesInPack: number;
  packCigarettesPrice: number;
  cigarettesAvoided: number;
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

export interface IParams {
  id: string;
}

export interface IQuery {
  PayerID: string;
  paymentId: string;
}

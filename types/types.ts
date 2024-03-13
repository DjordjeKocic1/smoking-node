import { ObjectId, Types } from "mongoose";

export interface ErrorMsg {
  statusCode: number;
  message: string;
}
export interface IUserBasicInfo {
  address: string;
  city: string;
  country: string;
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

export enum UserTypes {
  User = "user",
  Mentor = "mentor",
}
export interface IPlans {
  _id: string;
  name: string;
  userType?: UserTypes;
  userId?: string;
  plansId?: string;
}
export interface ISubscription {
  subscriber: boolean;
  subscribeDate: string;
}
export interface IUser {
  type?: string;
  _id: any;
  name: string;
  email: string;
  password: string;
  repassword: string;
  address: string;
  city: string;
  image: string;
  userVerified: boolean;
  userBasicInfo: IUserBasicInfo;
  healthInfo: IHealthInfo;
  smokingInfo: ISmokingInfo;
  consumptionInfo: IConsumptionInfo;
  savedInfo: IConsumptionInfo;
  plans: IPlans[];
  calculateHealth: (user: IUser, req?: any) => Promise<IUser>;
  calculateCosts: (user: IConsumptionInfo) => Promise<IConsumptionInfo>;
  toObject: Function;
  categories: ICategorie[];
  notificationToken: string;
  tasks: ITaskUser[];
  mentors: IMentoringUser[];
  achievements: IAchievementUser[];
  gameScore: number;
  save: () => Promise<IUser>;
  subscription: ISubscription;
  apiKey: string;
  token: string;
}

export interface IMentoringUser {
  _id?: string;
  userId?: string;
  mentorId?: string;
  email: string;
  name: string;
  accepted?: boolean;
  _doc?: any;
}
export interface IMentor {
  _id: any;
  name: string;
  email: string;
  userId: any;
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
  _doc?: any;
}

export enum Session {
  tokenRequest = "tokenRequest",
  deleteRequest = "deleteRequest",
}
export interface ISession {
  type: string;
  userId: string;
  email: string;
  token: string;
}
export interface ITask {
  _id: string;
  toDo: string;
  status: string;
  comment: string;
  userId: string;
  mentorId: string;
}

export interface IFeedBack {
  email: string;
  message: string;
}

export interface ITaskUser {
  toDo: string;
  status: string;
  comment: string;
  mentorId: string;
  _id?: any;
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

export interface IMentorUpdatePayload {
  name: string;
  user: {
    userId: string;
    accepted: boolean;
    name: string;
  };
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
  userId?: string;
  mentorId?: string;
  token?: string;
}

export interface IQuery {
  PayerID: string;
  paymentId: string;
}

export interface IQueryParams {
  isTask?: string;
  isMentoring?: string;
}

export interface IEmail {
  name: string;
  email: string;
  templateId: number;
  params: IEmailParams;
  subject: string;
  token?: string;
}

export interface IEmailParams {
  id: string;
  name: string;
  email: string;
  price: string;
}

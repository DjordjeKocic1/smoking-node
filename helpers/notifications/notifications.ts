import { Expo, ExpoPushTicket } from "expo-server-sdk";

import { INotificaionMessage } from "../../types/types";

const sendPushNotification = (
  notificationMessage: INotificaionMessage
): Promise<ExpoPushTicket[]> => {
  const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });
  const chunks = expo.chunkPushNotifications([notificationMessage]);
  return expo.sendPushNotificationsAsync(chunks[0]);
};

export const expoNotification = {
  sendPushNotification,
};

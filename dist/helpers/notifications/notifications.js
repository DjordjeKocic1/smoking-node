"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expoNotification = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const sendPushNotification = (notificationMessage) => {
    const expo = new expo_server_sdk_1.Expo({ accessToken: process.env.ACCESS_TOKEN });
    const chunks = expo.chunkPushNotifications([notificationMessage]);
    return expo.sendPushNotificationsAsync(chunks[0]);
};
exports.expoNotification = {
    sendPushNotification,
};

const checkExpireNotification = (lastNotificationSentAt) => {
    const currentTimeObj = new Date();
    const fifteenMinutesAgo = new Date(currentTimeObj.getTime() - 15 * 60 * 1000);
    return !lastNotificationSentAt || new Date(lastNotificationSentAt) < fifteenMinutesAgo;
};

export default checkExpireNotification;

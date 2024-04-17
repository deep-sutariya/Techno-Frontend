const checkExpireNotification = (lastNotificationSentAt) => {
    const currentTime = new Date().getTime();
    const fifteenMinutesAgo = new Date(currentTime - 10 * 60 * 1000).getTime();

    const lastNotificationTimestamp = new Date(lastNotificationSentAt).getTime();
    
    console.log("-->" + (lastNotificationTimestamp + ">" + fifteenMinutesAgo) + "<--");
    return lastNotificationSentAt==null || lastNotificationTimestamp < fifteenMinutesAgo;
};

export default checkExpireNotification;
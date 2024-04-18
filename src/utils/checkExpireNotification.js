const checkExpireNotification = (lastNotificationSentAt) => {
    const currentTime = new Date().getTime();
    const fifteenMinutesAgo = new Date(currentTime - 10 * 60 * 1000).getTime();

    const lastNotificationTimestamp = new Date(lastNotificationSentAt).getTime();
    
    // console.log("-->" + (!lastNotificationSentAt || lastNotificationTimestamp < fifteenMinutesAgo) + "<--");
    // console.log("-->" + (currentTime + "--" + lastNotificationTimestamp + "--" + fifteenMinutesAgo) + "<--");
    return !lastNotificationSentAt || lastNotificationTimestamp < fifteenMinutesAgo;
};

export default checkExpireNotification;
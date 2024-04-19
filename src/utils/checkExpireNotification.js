const checkExpireNotification = (lastNotificationSentAt) => {
    if(!lastNotificationSentAt) return true;
    const currentTime = new Date().getTime();
    const fifteenMinutesAgo = new Date(currentTime - 5 * 60 * 1000).getTime();

    const lastNotificationTimestamp = new Date(lastNotificationSentAt).getTime();
    
    // console.log("-->" + (!lastNotificationSentAt || lastNotificationTimestamp < fifteenMinutesAgo) + "<--");
    console.log("-->" + ( lastNotificationTimestamp + "--" + fifteenMinutesAgo) + "<--");
    return lastNotificationTimestamp < fifteenMinutesAgo;
};

export default checkExpireNotification;
const isNotificationExpired = (lastNotificationSentAt) => {
    if (!lastNotificationSentAt) {
        return true;
    }
    const currentTime = new Date();
    const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60 * 1000); // 15 minutes ago
    console.log("Expire-->",lastNotificationSentAt < fifteenMinutesAgo)
    return lastNotificationSentAt < fifteenMinutesAgo;
};

export default isNotificationExpired
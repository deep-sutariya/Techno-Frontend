export default checkLocation = (userLocations,locationList) => {
    for (const item1 of userLocations) {
        for (const item2 of locationList) {
            if (
                item1.address === item2.address ||
                (item1.location.lat === item2.location.lat && item1.location.lng === item2.location.lng)
            ) {
                return true;
            }
        }
    }
    return false
}
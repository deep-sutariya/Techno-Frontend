const checkLocation = (loc, locationList) => {
    
    if (loc?.lat && loc?.lon) {
        const threshold = 0.005; //Arround 500 mt

        for (const item1 of locationList) {
            const latDiff = Math.abs(item1.location.lat - loc.lat);
            const lngDiff = Math.abs(item1.location.lng - loc.lon);

            if (latDiff <= threshold && lngDiff <= threshold) {
                return {status:true,data:item1};
            }
        }
    }
    return {status:false, data: {}};
};

export default checkLocation;

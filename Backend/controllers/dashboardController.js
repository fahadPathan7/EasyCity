// external imports

// internal imports
const Sts = require('../models/Sts');
const Landfill = require('../models/Landfill');
const Vehicle = require('../models/Vehicle');
const Bill = require('../models/Bill');

// vehicles travelling to landfill. time of arrival and departure of sts will be not null
const getVehiclesToLandfill = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({
            timeOfArrivalSts: { $ne: null },
            timeOfDepartureSts: { $ne: null }
        });

        // send vehicleNumber, capacity, type, timeOfDepartureSts, stsID and landfillID for each vehicle.
        const vehiclesToLandfill = vehicles.map((vehicle) => ({
            vehicleNumber: vehicle.vehicleNumber,
            type: vehicle.type,
            capacity: vehicle.capacity,
            stsID: vehicle.stsID,
            landfillID: vehicle.landfillID,
            timeOfDepartureSts: vehicle.timeOfDepartureSts
        }));

        res.status(200).json({
            vehiclesToLandfill
        });
    }
    catch (err) {
        next(err);
    }
}

// vehicles travelling to sts. time of arrival and departure of landfill will be not null
const getVehiclesToSts = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({
            timeOfArrivalLandfill: { $ne: null },
            timeOfDepartureLandfill: { $ne: null }
        });

        // send vehicleNumber, capacity, type, timeOfDepartureLandfill, stsID and landfillID
        const vehiclesToSts = vehicles.map((vehicle) => ({
            vehicleNumber: vehicle.vehicleNumber,
            type: vehicle.type,
            capacity: vehicle.capacity,
            stsID: vehicle.stsID,
            landfillID: vehicle.landfillID,
            timeOfDepartureLandfill: vehicle.timeOfDepartureLandfill
        }));

        res.status(200).json({
            vehiclesToSts
        });
    }
    catch (err) {
        next(err);
    }
}

// get current volume of waste in all landfills
const getVolumeOfWasteAtLandfills = async (req, res, next) => {
    try {
        const landfills = await Landfill.find();

        // send landfillID, name and volumeOfWaste
        const landfillStatus = landfills.map((landfill) => ({
            landfillID: landfill.landfillID,
            name: landfill.name,
            volumeOfWaste: landfill.volumeOfWaste
        }));

        res.status(200).json({
            landfillStatus
        });
    }
    catch (err) {
        next(err);
    }
}

// send sum of bills for each day. last seven days
const getDailyCost = async (req, res, next) => {
    try {
        // get current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // get last seven days
        const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentYear, currentMonth, currentDay);
            date.setDate(date.getDate() - i);
            return date;
        });

        // get sum of totalCost for each day
        const dailyCost = await Promise.all(dates.map(async (date) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const bills = await Bill.find({
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            });

            const sum = bills.reduce((acc, bill) => acc + bill.totalCost, 0);

            return sum;
        }));

        res.status(200).json({
            dailyCost: {
                [dates[0]]: dailyCost[0],
                [dates[1]]: dailyCost[1],
                [dates[2]]: dailyCost[2],
                [dates[3]]: dailyCost[3],
                [dates[4]]: dailyCost[4],
                [dates[5]]: dailyCost[5],
                [dates[6]]: dailyCost[6]
            }
        });
    }
    catch (err) {
        next(err);
    }
}

// find the number of bills for last seven days
const getDailyTripCount = async (req, res, next) => {
    try {
        // get current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // get last seven days
        const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentYear, currentMonth, currentDay);
            date.setDate(date.getDate() - i);
            return date;
        });

        // get number of bills for each day
        const dailyTrips = await Promise.all(dates.map(async (date) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const trips = await Bill.find({
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            });

            return trips.length;
        }));

        res.status(200).json({
            dailyTrips: {
                [dates[0]]: dailyTrips[0],
                [dates[1]]: dailyTrips[1],
                [dates[2]]: dailyTrips[2],
                [dates[3]]: dailyTrips[3],
                [dates[4]]: dailyTrips[4],
                [dates[5]]: dailyTrips[5],
                [dates[6]]: dailyTrips[6]
            }
        });
    }
    catch (err) {
        next(err);
    }
}

// get total distance travelled for last seven days
const getTotalDistanceTravelled = async (req, res, next) => {
    try {
        // get current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // get last seven days
        const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentYear, currentMonth, currentDay);
            date.setDate(date.getDate() - i);
            return date;
        });

        // get total distance travelled for each day
        const totalDistance = await Promise.all(dates.map(async (date) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const bills = await Bill.find({
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            });

            const sum = bills.reduce((acc, bill) => acc + bill.twoWayDistance, 0);

            return sum;
        }));

        res.status(200).json({
            totalDistance: {
                [dates[0]]: totalDistance[0],
                [dates[1]]: totalDistance[1],
                [dates[2]]: totalDistance[2],
                [dates[3]]: totalDistance[3],
                [dates[4]]: totalDistance[4],
                [dates[5]]: totalDistance[5],
                [dates[6]]: totalDistance[6]
            }
        });
    }
    catch (err) {
        next(err);
    }
}

// get total volume of waste transferred for last seven days
const getTotalVolumeOfWasteTransferred = async (req, res, next) => {
    try {
        // get current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // get last seven days
        const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentYear, currentMonth, currentDay);
            date.setDate(date.getDate() - i);
            return date;
        });

        // get total volume of waste transported for each day
        const totalVolume = await Promise.all(dates.map(async (date) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const bills = await Bill.find({
                createdAt: { $gte: startOfDay, $lt: endOfDay }
            });

            const sum = bills.reduce((acc, bill) => acc + bill.volumeOfWaste, 0);

            return sum;
        }));

        res.status(200).json({
            totalVolume: {
                [dates[0]]: totalVolume[0],
                [dates[1]]: totalVolume[1],
                [dates[2]]: totalVolume[2],
                [dates[3]]: totalVolume[3],
                [dates[4]]: totalVolume[4],
                [dates[5]]: totalVolume[5],
                [dates[6]]: totalVolume[6]
            }
        });
    }
    catch (err) {
        next(err);
    }
}

// get volume of waste transferred by each sts for today
const getVolumeOfWasteTransferredBySts = async (req, res, next) => {
    try {
        // get current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // get today
        const today = new Date(currentYear, currentMonth, currentDay);
        today.setHours(0, 0, 0, 0);

        // get stsID and volumeOfWasteTransferred for each sts
        const stsDocuments = await Sts.find();
        const stsVolumePromises = stsDocuments.map(async (sts) => {
            const bills = await Bill.find({
                stsID: sts.stsID,
                createdAt: { $gte: today }
            });

            const sum = bills.reduce((acc, bill) => acc + bill.volumeOfWaste, 0);

            return {
                stsID: sts.stsID,
                volumeOfWasteTransferred: sum
            };
        });

        const stsWasteTransferred = await Promise.all(stsVolumePromises);

        res.status(200).json({
            stsWasteTransferred
        });
    }
    catch (err) {
        next(err);
    }
}

// export
module.exports = {
    getVehiclesToLandfill,
    getVehiclesToSts,
    getVolumeOfWasteAtLandfills,
    getDailyCost,
    getDailyTripCount,
    getTotalDistanceTravelled,
    getTotalVolumeOfWasteTransferred,
    getVolumeOfWasteTransferredBySts
};
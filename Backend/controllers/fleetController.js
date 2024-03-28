// external imports
const createError = require('http-errors');

// internal imports
const Sts = require('../models/Sts');
const Landfill = require('../models/Landfill');
const Vehicle = require('../models/Vehicle');

// create fleet
// The STS manager can generate the fleet of
// trucks he or she needs to deploy for the day to ensure fastest waste
// transfer from STS to landfill site. A number of trucks with varying load
// capacity are attached to each landfill. The system should assist
// finding the required number of trucks to transfer maximum possible
// waste from the STS to the Landfill. The following parameters can be
// taken into consideration:
// ○ Each truck can have at most 3 trips.
// ○ Trucks should be chosen to first ensure minimum fuel
// consumption cost, second to ensure minimum number of
// trucks.
// ○ The distance from STS to Landfill should be considered
// constant as the paths are pre-selected.

// this function will be used to calculate the distance between STS and Landfill
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

// solution approach: each sts has multiple trucks with varying load capacity. the system should find the required number of trucks to transfer maximum possible waste from the sts to the landfill. the landfill destination maybe different for each vehicle. it will be found from the vehicle object. i will do a greedy approach. firstly i will sort the vehicles according to cost per km of fully loaded cost. equation: costPerKM = vehicle.fullyLoadedCost. sort these in ascending order. each vehicle can travell 3 times. i will keep a counter for each vehicle. i will keep a counter for total waste transfered. i will keep a counter for total cost. i will keep a counter for total number of vehicles. i will keep a counter for total distance. i will keep a counter for total trips. i will keep a counter for total fuel consumption
const createFleet = async (req, res, next) => {
    try {
        // get the stsID from the logged in user
        const sts = await Sts.findOne({
            stsManagers: req.user.userID
        });

        if (!sts) {
            return next(createError(404, 'User is not an STS manager.'));
        }

        // get all vehicles in the sts
        const vehicles = await Vehicle.find({
            stsID: sts.stsID
        });

        // sort vehicles according to total cost per ton. ascending order. each vehicle has landfill destination. i will use this to calculate the distance between sts and landfill. use getDistanceFromLatLonInKm function to calculate and sort the vehicles.
        vehicles.sort(async (a, b) => {
            try {
                // each has landfillID. i will find the landfill object from the landfillID. then i will find the distance between sts and landfill. then i will calculate the cost per km. then i will sort the vehicles according to this cost per km.
                const landfillA = await Landfill.findOne({
                    landfillID: a.landfillID
                });

                const landfillB = await Landfill.findOne({
                    landfillID: b.landfillID
                });

                const distanceA = getDistanceFromLatLonInKm(sts.latitude, sts.longitude, landfillA.latitude, landfillA.longitude);
                const distanceB = getDistanceFromLatLonInKm(sts.latitude, sts.longitude, landfillB.latitude, landfillB.longitude);

                const totalCostPerTonA = (a.fullyLoadedCost * distanceA) / a.capacity;
                const totalCostPerTonB = (b.fullyLoadedCost * distanceB) / b.capacity;

                return totalCostPerTonA - totalCostPerTonB; // ascending order of cost per ton
            } catch (error) {
                next(error);
            }

        });

        // i need to store the chosen vehicleNumber. distance covered by each vehicle per trip. cost of each vehicle per trip. trip count of each vehicle (max 3). these should be connected to a object. i will use an array of objects to store these. and send this array as response. additionally i will send the total cost, total distance, total trips, total waste transfered, total number of vehicles. i have given the waste need to be transfered. i should run the array of objects until the waste is transfered. i should maintain that no more waste is not transferred. then i have to break the loop.

        // initialize the variables
        let totalCost = 0;
        let totalDistance = 0;
        let totalTrips = 0;
        let totalWasteTransfered = 0;
        let totalNumberOfVehicles = 0;
        let fleet = [];
        const wasteNeedToBeTransfered = 1000; // 1000 tons of waste need to be transfered

        // iterate over the vehicles
        for (let i = 0; i < vehicles.length; i++) {
            // find the landfill object
            const landfill = await Landfill.findOne({
                landfillID: vehicles[i].landfillID
            });

            // get the distance between sts and landfill
            const distance = getDistanceFromLatLonInKm(sts.latitude, sts.longitude, landfill.latitude, landfill.longitude);

            // calculate the cost per ton
            const costPerTon = (vehicles[i].fullyLoadedCost * distance) / vehicles[i].capacity;

            // calculate the distance covered by each vehicle per trip
            const distancePerTrip = distance * 2; // two way distance

            // calculate the cost of each vehicle per trip
            const costPerTrip = vehicles[i].fullyLoadedCost * distance;

            // trip count of each vehicle (max 3)
            let tripCount = 0;

            // iterate over the trips
            while (totalWasteTransfered < wasteNeedToBeTransfered && tripCount < 3) {
                // check if the vehicle can carry the waste
                if (totalWasteTransfered + vehicles[i].capacity <= wasteNeedToBeTransfered) {
                    // add the vehicle to the fleet
                    fleet.push({
                        vehicleNumber: vehicles[i].vehicleNumber,
                        distancePerTrip: distancePerTrip,
                        costPerTrip: costPerTrip
                    });

                    // update the variables
                    totalCost += costPerTrip;
                    totalDistance += distancePerTrip;
                    totalTrips += 1;
                    totalWasteTransfered += vehicles[i].capacity;
                    totalNumberOfVehicles += 1;

                    // update the trip count
                    tripCount += 1;
                } else {
                    break;
                }
            }
        }


    }
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
        let vehicles = await Vehicle.find({
            stsID: sts.stsID
        });

        console.log(vehicles); //! remove this

        // sort vehicles according to total cost per ton. ascending order. each vehicle has landfill destination. i will use this to calculate the distance between sts and landfill. use getDistanceFromLatLonInKm function to calculate and sort the vehicles.
        try {
            const vehiclesWithCosts = await Promise.all(vehicles.map(async (vehicle) => {
              const landfill = await Landfill.findOne({ landfillID: vehicle.landfillID });
              const distance = getDistanceFromLatLonInKm(sts.latitude, sts.longitude, landfill.latitude, landfill.longitude);
              const totalCostPerTon = ((vehicle.fullyLoadedCost * distance) + (vehicle.unloadedCost * distance)) / vehicle.capacity;
              return { vehicle, totalCostPerTon };
            }));

            vehiclesWithCosts.sort((a, b) => a.totalCostPerTon - b.totalCostPerTon);

            vehicles = vehiclesWithCosts.map(item => item.vehicle);
          } catch (error) {
            next(error);
          }

        console.log(vehicles); //! remove this

        // i need to store the chosen vehicleNumber. distance covered by each vehicle per trip. cost of each vehicle per trip. trip count of each vehicle (max 3). these should be connected to a object. i will use an array of objects to store these. and send this array as response. additionally i will send the total cost, total distance, total trips, total waste transfered, total number of vehicles. i have given the waste need to be transfered. i should run the array of objects until the waste is transfered. i should maintain that no more waste is not transferred. then i have to break the loop.

        // initialize the variables
        let totalCost = 0;
        let totalDistance = 0;
        let totalTrips = 0;
        let totalWasteTransfered = 0;
        let totalNumberOfVehicles = 0;
        let fleet = [];
        const wasteToTransfer = req.params.wasteNeedToTransfer;
        let wasteNeedToBeTransfered = wasteToTransfer;

        // iterate over the vehicles
        for (let i = 0; i < vehicles.length; i++) {
            // find the landfill object
            const landfill = await Landfill.findOne({
                landfillID: vehicles[i].landfillID
            });

            // get the distance between sts and landfill
            const distance = getDistanceFromLatLonInKm(sts.latitude, sts.longitude, landfill.latitude, landfill.longitude);

            // calculate the distance covered by each vehicle per trip
            const distancePerTrip = distance * 2; // two way distance

            // calculate the cost of each vehicle per trip
            let costPerTrip = vehicles[i].fullyLoadedCost * distance + vehicles[i].unloadedCost * distance;

            // trip count of each vehicle (max 3)
            let tripCount = 0;

            // iterate over the trips
            while (totalWasteTransfered < wasteToTransfer && tripCount < 3) {
                // check if the vehicle can carry the waste
                if (totalWasteTransfered + vehicles[i].capacity <= wasteToTransfer) {
                    const averageCostPerTonPerKm = costPerTrip / (vehicles[i].capacity * distance);
                    // add the vehicle to the fleet
                    fleet.push({
                        vehicleNumber: vehicles[i].vehicleNumber,
                        stsID: sts.stsID,
                        landfillID: vehicles[i].landfillID,
                        capacity: vehicles[i].capacity,
                        volumeOfWaste: vehicles[i].capacity,
                        tripDistance: distancePerTrip,
                        averageCostPerTonPerKm: averageCostPerTonPerKm,
                        tripCost: costPerTrip,
                        tripCount: tripCount + 1,
                    });

                    // update the variables
                    totalCost += costPerTrip;
                    totalDistance += distancePerTrip;
                    totalTrips += 1;
                    totalWasteTransfered += vehicles[i].capacity;
                    if (tripCount === 0) totalNumberOfVehicles += 1;

                    wasteNeedToBeTransfered -= vehicles[i].capacity;

                    // update the trip count
                    tripCount += 1;
                } else {
                    if (wasteNeedToBeTransfered === 0) {
                        break;
                    }
                    costPerTrip = vehicles[i].unloadedCost + (vehicles[i].fullyLoadedCost - vehicles[i].unloadedCost) * (wasteNeedToBeTransfered / vehicles[i].capacity);
                    costPerTrip = costPerTrip * distance + vehicles[i].unloadedCost * distance;
                    const averageCostPerTonPerKm = costPerTrip / (wasteNeedToBeTransfered * distance);
                    // add the vehicle to the fleet
                    fleet.push({
                        vehicleNumber: vehicles[i].vehicleNumber,
                        stsID: sts.stsID,
                        landfillID: vehicles[i].landfillID,
                        capacity: vehicles[i].capacity,
                        volumeOfWaste: wasteNeedToBeTransfered,
                        tripDistance: distancePerTrip,
                        averageCostPerTonPerKm: averageCostPerTonPerKm,
                        tripCost: costPerTrip,
                        tripCount: tripCount + 1,
                    });

                    // update the variables
                    totalCost += costPerTrip;
                    totalDistance += distancePerTrip;
                    totalTrips += 1;
                    totalWasteTransfered += wasteNeedToBeTransfered;
                    if (tripCount === 0) totalNumberOfVehicles += 1;

                    wasteNeedToBeTransfered = 0;

                    // update the trip count
                    tripCount += 1;

                    break;
                }
            }
            if (wasteNeedToBeTransfered === 0) {
                break;
            }
        }

        // send the response
        res.status(200).json({
            fleet,
            totalCost,
            totalDistance,
            totalTrips,
            totalWasteTransfered,
            remainingWaste: wasteNeedToBeTransfered,
            totalNumberOfVehicles
        });
    }
    catch (error) {
        next(error);
    }
}

// export
module.exports = {
    createFleet
};
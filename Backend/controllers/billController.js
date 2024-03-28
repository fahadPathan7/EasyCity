// external imports

// internal imports
const Bill = require('../models/Bill');

// get a bill with billID
const getABill = async (req, res, next) => {
    try {
        const bill = await Bill.findOne({
            billID: req.params.billID
        }).select('-_id -__v');
        if (!bill) {
            return res.status(404).json({
                "message": "Bill not found."
            });
        }
        res.status(200).json({
            bill
        });
        // it will return a bill
    } catch (error) {
        next(error);
    }
}

// get all bills
const getAllBills = async (req, res, next) => {
    try {
        const bills = await Bill.find().select('-_id -__v');
        res.status(200).json({
            bills
        });
        // it will return all bills
    } catch (error) {
        next(error);
    }
}

// export
module.exports = {
    getABill,
    getAllBills
};
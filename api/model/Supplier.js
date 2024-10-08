import mongoose from "mongoose";

const supplierSchema = mongoose.Schema(
    {
        SupplierID: {
            type: String,
            unique: true
        },
        SupplierName: {
            type: String,
            required: true,
        },
        Companyname: {
            type: String,
            required: true,
        },
        ItemNo: {
            type: String,
           
        },
        ItemName: {
            type: String,
            required: true,
        },
        ContactNo: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
        },
        Address: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'declined'],
            default: 'pending'
        }
    }
);

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 1 }
});

const SCounterr = mongoose.model('SCounterr', counterSchema);

supplierSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const doc = await SCounterr.findOneAndUpdate(
                { _id: 'SupplierID' }, 
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true });
            this.SupplierID = 'SUP' + doc.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const Supplier = mongoose.model('Supplier', supplierSchema);

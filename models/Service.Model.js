import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    image: {
        fileName: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    formLink: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const Service = mongoose.model("Service", serviceSchema);

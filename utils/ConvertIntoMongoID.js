import mongoose from "mongoose";

export const ConvertIntoMongoID = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    } else {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
};
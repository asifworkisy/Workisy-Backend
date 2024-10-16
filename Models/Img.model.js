import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    }
}, { timestamps: true }); 

export default mongoose.model("IMGModel", ImageSchema);

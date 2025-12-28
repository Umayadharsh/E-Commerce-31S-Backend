import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String], // store image URL or filename
      required: true,
      validate: [arr => arr.length >= 1, "At least one image required"],
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },

    type: {
      type: String,
      enum: ["chain", "pendant", "bracelet"],
      required: true,
    },

    collection: {
      type: String,
      enum: ["classic", "pendant", "minimal"],
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const productModel = mongoose.models.product ||  mongoose.model("Product", productSchema);

export default productModel;

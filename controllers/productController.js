import productModel from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * ✅ Upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * 🔥 ADD PRODUCT
 */
const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images received",
      });
    }

    // ✅ Upload all images
    const imageUrls = [];

    for (const file of req.files) {
      const imageUrl = await uploadToCloudinary(file.buffer);
      imageUrls.push(imageUrl);
    }

    const product = await productModel.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      bestseller: req.body.bestseller === "true",
      gender: req.body.gender,
      type: req.body.type,
      collection: req.body.collection,
      images: imageUrls,
      createdAt: Date.now(),
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🔥 LIST PRODUCTS
 */
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 🔥 REMOVE PRODUCT
 */
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 🔥 SINGLE PRODUCT
 */
const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * 🔥 UPDATE PRODUCT
 */
const updateProduct = async (req, res) => {
  try {
    const { id, name, price, description, gender, type, collection, bestseller } =
      req.body;

    await productModel.findByIdAndUpdate(id, {
      name,
      price,
      description,
      gender,
      type,
      collection,
      bestseller,
    });

    res.json({ success: true, message: "Product updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
};

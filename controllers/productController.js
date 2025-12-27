import productModel from "../models/productModel.js";

import cloudinary from "../config/cloudinary.js";


// 🔹 Upload helper
const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "products",
  });
  return result.secure_url;
};

// 🔥 ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    // 🔥 FORCE CONFIG HERE (bullet-proof)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images received",
      });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      imageUrls.push(result.secure_url);
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
      date: Date.now(),
    });
    console.log("FILES:", req.files);
console.log("BODY:", req.body);

    res.json({ success: true, product });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔥 LIST PRODUCTS
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find().sort({ createdAt: -1 });
        res.json({success:true,products})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }

};

// 🔥 REMOVE PRODUCT
const removeProduct = async (req, res) => {
  try{
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.json({success:true,message:"Product removed"})
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
  }
  

};

// 🔥 SINGLE PRODUCT
const singleProduct = async (req, res) => {
  try{
    const { id } = req.body;
     const product = await productModel.findById(id);
     res.json({success:true,product})
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
  }


};

const updateProduct = async (req, res) => {
  try {
    const { id, name, price, description, gender, type, collection, bestseller } = req.body;

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

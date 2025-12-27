import Cart from "../models/cartModel.js";

// GET CART
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId });
  res.json({ success: true, cart: cart || { items: [] } });
};

// SAVE CART
export const saveCart = async (req, res) => {
  const { items } = req.body;

  let cart = await Cart.findOne({ userId: req.userId });

  if (cart) {
    cart.items = items;
    await cart.save();
  } else {
    cart = await Cart.create({ userId: req.userId, items });
  }

  res.json({ success: true });
};

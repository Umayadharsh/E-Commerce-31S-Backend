const orderStatusEmail = (name, orderId, status) => {
  return `
Hi ${name},

Your order (${orderId}) status has been updated.

📦 Current Status: ${status}

Thank you for shopping with us ❤️  
We’ll keep you updated on your delivery.

— Your Store Team
`;
};

export default orderStatusEmail;

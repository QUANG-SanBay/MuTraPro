export const createOrder = async (orderData) => {
  try {
    const response = await fetch("http://localhost:4001/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create order: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

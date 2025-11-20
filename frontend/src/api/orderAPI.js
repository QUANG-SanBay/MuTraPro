export const createOrder = async (formData) => {
  try {
    const response = await fetch("http://localhost:4001/orders/upload", {
      method: "POST",
      body: formData, // Gửi trực tiếp FormData, không set Content-Type
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

export const createOrder = async (formData) => {
  const response = await fetch("http://localhost:8000/api/orders", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
};

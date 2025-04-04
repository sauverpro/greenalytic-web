export const errorHandler = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    message: "An error occurred while processing your request", error: error.message,
    
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

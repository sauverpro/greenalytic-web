// Your axios instance
 // Assuming you have a `User` type

import API from "@/api/api";
import { User } from "@/types/types";

// Login service
export const login = async (email: string, password: string) => {
  try {
    const response = await API.post("/users/login", { email, password });
    return response.data; 
  } catch (error) {
    throw new Error("Login failed");
  }
};

// Signup service
export const signup = async (userData: {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  try {
    const response = await API.post("/users/signup", userData);
    return response.data; // Return the response (e.g., success message, user data)
  } catch (error) {
    throw new Error("Signup failed");
  }
};

// Get all users
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(`/users?page=${page}&limit=${limit}`);
    return response.data; // Return full response including pagination
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
};


// Get a user by ID
export const getUserById = async (id: string) => {
  try {
    const response = await API.get(`/users/${id}`);
    return response.data; // Return the specific user data
  } catch (error) {
    throw new Error(`Failed to fetch user with ID: ${id}`);
  }
};

// Update a user by ID
export const updateUser = async (id: string, updateData: Partial<User>) => {
  try {
    const response = await API.patch(`/users/${id}`, updateData);
    return response.data; // Return the updated user data
  } catch (error) {
    throw new Error(`Failed to update user with ID: ${id}`);
  }
};

// Delete a user by ID
export const deleteUser = async (id: string) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return response.data; // Return success message or status
  } catch (error) {
    throw new Error(`Failed to delete user with ID: ${id}`);
  }
};


import useAxiosClient from '../../hooks/axiosClient';
import { User } from "@/types/types";

const client = useAxiosClient();

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await client.post("users/login", formData);
    if (response.status === 200) {
      localStorage.setItem("AUTH_TOKEN", response.data.access_token);
      const userRole = response.data.user.role.toLowerCase();
      localStorage.setItem("USER_ROLE", userRole);
      return { success: true, role: userRole };
    }
    return { success: false, message: "Login failed" };
  } catch (error: any) {
    console.error("Login failed:", error);
    throw new Error("Wrong credentials.");
  }
};


export const signup = async (userData: {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  try {
    const response = await client.post("/users/signup", userData);
    return response.data; 
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Signup failed: ${error.message}`);
    } else {
      throw new Error("Signup failed");
    }
  }
};

export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await client.get(`/users?page=${page}&limit=${limit}`);
    return response.data; 
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
};


export const getUserById = async (id: string) => {
  try {
    const response = await client.get(`/users/${id}`);
    return response.data; 
  } catch (error) {
    throw new Error(`Failed to fetch user with ID: ${id}`);
  }
};

export const updateUser = async (id: string, updateData: Partial<User>) => {
  try {
    const response = await client.patch(`/users/${id}`, updateData);
    return response.data; 
  } catch (error) {
    throw new Error(`Failed to update user with ID: ${id}`);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await client.delete(`/users/${id}`);
    return response.data; 
  } catch (error) {
    throw new Error(`Failed to delete user with ID: ${id}`);
  }
};

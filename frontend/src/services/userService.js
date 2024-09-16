// frontend/src/services/userService.js

import axios from 'axios';

// Asegúrate de que la URL apunte correctamente a tu backend
const API_URL = "http://localhost:8000/api";  // Cambia esto según corresponda

export const getUsers = () => axios.get(`${API_URL}/users`);  // GET request to fetch all users
export const createUser = (data) => axios.post(`${API_URL}/users`, data);  // POST request to create a new user
export const updateUser = (id, data) => axios.put(`${API_URL}/users/${id}`, data);  // PUT request to update an existing user
export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`);  // DELETE request to remove a user

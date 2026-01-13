import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Upload image to backend
export async function uploadImage(file, type = 'general') {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);

  const response = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload image');
  }

  return data.url;
}

// Upload multiple images
export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const response = await fetch(`${API_URL}/upload/images`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload images');
  }

  return data.urls;
}

export function getDraftToken() {
  let token = localStorage.getItem('draftToken');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('draftToken', token);
  }
  return token;
}

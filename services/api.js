// apo.js


import { API_URL } from '@env';
export const loginUser = async ({ email, password }) => {

    const response = await fetch(`${API_URL}Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Invalid email or password');
    }
  
    return data; 
  };
  
  export const requestAssets = async ({ empId,reason,productDetail }) => {

    const response = await fetch(`${API_URL}Assests/SendAssestdetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empId,reason,productDetail }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message );
    }
  
    return data; 
  };
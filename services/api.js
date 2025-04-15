// apo.js
export const loginUser = async ({ email, password }) => {

    const response = await fetch('http://184.72.156.185/Test-APp/api/Auth/login', {
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

    const response = await fetch('http://184.72.156.185/Test-APp/api/Assests/SendAssestdetails', {
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
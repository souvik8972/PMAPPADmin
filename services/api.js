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
  
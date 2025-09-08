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
  console.log("Login successful:", data);
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

export async function getNewTokenBYRefreshToken(refToken) {

  const response = await fetch(`${API_URL}Auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( refToken ),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to refresh token');
  }

  return data;
}


export const fetchProjectList = async (accessTokenGetter) => {
  const token = await accessTokenGetter();
  const response = await fetch(`${API_URL}Projects/GetAllProjectNames`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

 export const fetchProjectDetails = async (projectId, accessTokenGetter) => {
  const token = await accessTokenGetter();
  const response = await fetch(`${API_URL}Projects/GetProjectDetailsById?projectId=${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export async function savePushTokenToBackend(empId, Expotoken, jwtToken) {
  console.log("Start-1111",Expotoken);

  try {
    const response = await fetch(
      `https://projectmanagement.medtrixhealthcare.com/ProjectManagmentApi/api/Notifications/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({  
          token: Expotoken,
          empid: empId
        }),
      }
    );

    console.log("sendToken", response);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
      throw new Error(`Failed to save push token: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response data:", responseData);
    return responseData;
    
  } catch (error) {
    console.error('Error in savePushTokenToBackend:', error);
    throw error;
  }
}

import { useRedirectIfTokenExpired } from "../../utils/auth";
import {exp} from "../../utils/functions/exp"

const postData = async ({ endpoint, data, token }) => {
  const url = `https://projectmanagement.medtrixhealthcare.com/ProjectManagmentApi/api/${endpoint}`;

   useRedirectIfTokenExpired(token)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Network response was not ok');
  }

  return response.json();
};

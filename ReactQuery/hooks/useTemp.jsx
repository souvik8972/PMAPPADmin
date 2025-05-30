import { useRedirectIfTokenExpired } from "../../utils/auth";
import {exp} from "../../utils/functions/exp"

import { API_URL } from '@env';
const postData = async ({ endpoint, data, token }) => {
  const url = `${API_URL}${endpoint}`;

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

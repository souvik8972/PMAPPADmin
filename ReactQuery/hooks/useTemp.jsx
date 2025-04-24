const postData = async ({ endpoint, data, token }) => {
  const url = `http://184.72.156.185/Test-APp/api/${endpoint}`;

  console.log("Response status:");
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

export const deleteTask = async (taskId, token) => {
  try {
    const response = await fetch(
      `http://184.72.156.185/Test-APp/api/Task/DeleteTask?TaskId=${taskId}`,
      {
        method: 'GET', // Using GET as required by backend
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // First check if response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse JSON response
    const result = await response.json();
    
    // Check if the API returned a success indicator
    if (result && result.success !== false) {
      return {
        success: true,
        message: result.message || 'Task deleted successfully',
        status: response.status
      };
    } else {
      throw new Error(result.message || 'Failed to delete task');
    }
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error; // Re-throw to handle in calling function
  }
};
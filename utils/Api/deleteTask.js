// utils/api.js
export const deleteTask = async (taskId, token) => {
    console.log(taskId,"response")
    try {
      const response = await fetch(`http://184.72.156.185/Test-APp/api/Task/DeleteTask?TaskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
 
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };
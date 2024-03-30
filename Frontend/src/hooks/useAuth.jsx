import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [authData, setAuthData] = useState({
    roles: [],
    status: "Unassigned",
    isSTSManager: false,
    isAdmin: false,
    isLandfillManager: false,
    isUnassigned: true // Add a flag for Unassigned
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/auth/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { roleIDs } = response.data.user;

        const isSTSManager = roleIDs.includes(2); // Assuming '2' represents STS Manager role
        const isAdmin = roleIDs.includes(1); // Assuming '1' represents System Admin role
        const isLandfillManager = roleIDs.includes(3); // Assuming '3' represents Landfill Manager role
        const isUnassigned = !roleIDs.length || roleIDs.includes(0); // Check if no roles or '0' is included for Unassigned

        let status = "Unassigned";
        if (isSTSManager) status = "STS Manager";
        else if (isLandfillManager) status = "Landfill Manager";
        else if (isAdmin) status = "System Admin";
        // No need to explicitly set status to "Unassigned" here, as it's the default

        setAuthData({
          roles: roleIDs,
          status,
          isSTSManager,
          isAdmin,
          isLandfillManager,
          isUnassigned // Update state with the new flag
        });
      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchData();
  }, []);

  return authData;
}

export default useAuth;

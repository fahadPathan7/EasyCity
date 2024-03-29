import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get('token');
        if (!token || !roles || roles.length === 0) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:3000/auth/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const { user } = response.data;
        const { roleIDs } = user;

        console.log(roleIDs);

        // Map role IDs to role names according to your logic
        const currentRoles = roleIDs.map(roleID => {
          // Map role IDs to role names as per your application logic
          switch (roleID) {
            case 1:
              return 'System Admin';
            case 2:
              return 'STS Manager';
            case 3 : 
              return 'Landfill Manager';
            default:
              return 'Unassigned';
          }
        });

        // Check if the user has any of the required roles
        const hasRequiredRoles = currentRoles.some(role => roles.includes(role));
        setIsAuthenticated(hasRequiredRoles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    fetchRoles();
  }, [roles]);

  if (loading) {
    return <div>Loading...</div>; // You can show a loading indicator here
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }else
  return (
        <Component/>
  );
};

export default ProtectedRoute;

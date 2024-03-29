// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState({});
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   

    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/rbac/roles", {
          withCredentials: true,
        });
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    //fetchUserProfile();
    fetchRoles();
  }, []);

  return (
    <AuthContext.Provider value={{ roles }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth2 = () => useContext(AuthContext);

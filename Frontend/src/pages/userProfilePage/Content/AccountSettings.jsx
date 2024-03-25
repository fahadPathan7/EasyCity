/* eslint-disable react/prop-types */
import { FormControl, FormLabel, Grid, Input, Select } from "@chakra-ui/react";
import axios from "axios";
import backendURL from "../../../lib/backendURL";
import { useState } from "react";
function AccountSettings({ userData }) {

  const mapRoleIdToRole = (roleId) => {
    switch (roleId) {
      case 1:
        return "System Admin";
      case 2:
        return "STS Manager";
      case 3:
        return "Landfill Manager";
      default:
        return "Not Assigned";
    }
  };


  // const [roles, setRoles] = useState([]);

  // useEffect(() => {
  //   // Fetch roles from the backend API
  //   axios.get(`${backendURL}/rbac/roles`)
  //     .then((response) => {
  //       setRoles(response.data.roles);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching roles:", error);
  //     });
  // }, []);

  // const mapRoleIdToRole = (roleId) => {
  //   const role = roles.find((role) => role.roleID === roleId);
  //   return role ? role.roleName : "Not Assigned";
  // };

  const [formData, setFormData] = useState({
    name: userData.name || "",
    mobile: userData.mobile || "",
    email: userData.email || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      gap={6}
    >
      {userData && (
        <>
          {userData.name && (
            <FormControl id="firstName">
              <FormLabel>First Name</FormLabel>
              <Input
                focusBorderColor="brand.blue"
                type="text"
                placeholder={userData.name}
              />
            </FormControl>
          )}
          {userData.name && (
            <FormControl id="lastName">
              <FormLabel>Last Name</FormLabel>
              <Input
                focusBorderColor="brand.blue"
                type="text"
                placeholder={userData.name}
              />
            </FormControl>
          )}
          {userData.mobile && (
            <FormControl id="phoneNumber">
              <FormLabel>Phone Number</FormLabel>
              <Input
                focusBorderColor="brand.black"
                type="tel"
                placeholder={userData.mobile}
              />
            </FormControl>
          )}
          {userData.email && (
            <FormControl id="emailAddress">
              <FormLabel>Email Address</FormLabel>
              <Input
                focusBorderColor="brand.blue"
                type="email"
                placeholder={userData.email}
              />
            </FormControl>
          )}
          {userData.roleIDs && userData.roleIDs.length > 0 && (
            <div>
              <p>Roles:</p>
              <ul>
                {userData.roleIDs.map((roleId, index) => (
                  <li key={index}>{mapRoleIdToRole(roleId)}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Grid>
  );
}

export default AccountSettings;
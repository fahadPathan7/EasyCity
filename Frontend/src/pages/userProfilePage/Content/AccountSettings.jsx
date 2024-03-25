/* eslint-disable react/prop-types */
import { FormControl, FormLabel, Grid, Input, Button, Text } from "@chakra-ui/react";
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

  const [formData, setFormData] = useState({
    name: userData.name || "",
    mobile: userData.mobile || "",
    email: userData.email || "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(
        `${backendURL}/updateUser`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      console.log(response.data);
    } catch (error) {
      setErrorMessage("Error updating user.");
      setSuccessMessage("");
      console.error("Error updating user:", error);
    }
  };

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      gap={6}
    >
      {userData && (
        <>
          {userData.userID && (
            <FormControl id="ID">
              <FormLabel>User ID</FormLabel>
              <Input
                focusBorderColor="brand.blue"
                type="text"
                value={userData.userID}
                readOnly
              />
            </FormControl>
          )}
          {userData.name && (
            <FormControl id="Name">
              <FormLabel>Name</FormLabel>
              <Input
                focusBorderColor="brand.blue"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
              />
            </FormControl>
          )}
          {userData.mobile && (
            <FormControl id="phoneNumber">
              <FormLabel>Phone Number</FormLabel>
              <Input
                focusBorderColor="brand.black"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                name="mobile"
              />
            </FormControl>
          )}
          {userData.email && (
            <FormControl id="emailAddress">
              <FormLabel>Email Address</FormLabel>
              <Input
                focusBorderColor="brand.blue"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
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
          <Button colorScheme="blue" onClick={updateUser}>
            Update
          </Button>
          {successMessage && <Text color="green">{successMessage}</Text>}
          {errorMessage && <Text color="red">{errorMessage}</Text>}
        </>
      )}
    </Grid>
  );
}

export default AccountSettings;

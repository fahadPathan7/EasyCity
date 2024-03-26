import { FormControl, FormLabel, Grid, Input, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

// Assuming backendURL is defined and exported from "../../../lib/backendURL";
import backendURL from "../../../lib/backendURL";

function AccountSettings() {
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendURL}/profile`, {
          withCredentials: true,
        });
        setUserData(response.data.user);
        setFormData({
          name: response.data.user.name || "",
          mobile: response.data.user.mobile || "",
          email: response.data.user.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

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
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error updating user.");
      setSuccessMessage("");
      console.error("Error updating user:", error);
    }
  };

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

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      gap={6}
    >
      {Object.keys(userData).length !== 0 && (
        <>
          <FormControl id="ID">
            <FormLabel>User ID</FormLabel>
            <Input
              focusBorderColor="brand.blue"
              type="text"
              value={userData.userID || ""}
              readOnly
            />
          </FormControl>
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
          <div>
            <p>Roles:</p>
            <ul>
              {userData.roleIDs && userData.roleIDs.map((roleId, index) => (
                <li key={index}>{mapRoleIdToRole(roleId)}</li>
              ))}
            </ul>
          </div>
          <Button colorScheme="blue" onClick={updateUser}>
            Update
          </Button>
          {successMessage && <Text color="green.500">{successMessage}</Text>}
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        </>
      )}
    </Grid>
  );
}

export default AccountSettings;

import { FormControl, FormLabel, Grid, Input, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

// Assuming backendURL is defined and exported from "../../../lib/backendURL";
import backendURL from "../../../lib/backendURL";

function AccountSettings() {
  const [userData, setUserData] = useState({});
  const [roles, setRoles] = useState([]); // Added state for roles
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserDataAndRoles = async () => {
      try {
        const userResponse = await axios.get(`${backendURL}/profile`, {
          withCredentials: true,
        });
        console.log("AccountSetting response: ", userResponse);
        setUserData(userResponse.data.user);
        setFormData({
          name: userResponse.data.user.name || "",
          mobile: userResponse.data.user.mobile || "",
          email: userResponse.data.user.email || "",
        });

        // Fetch roles
        const rolesResponse = await axios.get(`${backendURL}/rbac/roles`, {
          withCredentials: true,
        });
        setRoles(rolesResponse.data.roles);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data.");
      }
    };

    fetchUserDataAndRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const updateUser = async () => {
  // Ensure you have the userID to update. It might come from the userData state, or another source.
  if (!userData.userID) {
    setErrorMessage("No user ID provided.");
    return;
  }

  try {
    const response = await axios.put(
      `${backendURL}/users/${userData.userID}`, // Using template literals to include the userID
      {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile, // Assuming 'mobile' in formData should map to 'phone' in the request body
      },
      {
        withCredentials: true,
      }
    );

    // Check if the response has the expected message field
    if (response.data && response.data.message) {
      setSuccessMessage(response.data.message);
      
      setErrorMessage(""); // Clear any previous error messages
    } else {
      // Handle unexpected response structure
      throw new Error("Unexpected response structure from the server.");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    setSuccessMessage(""); // Clear any previous success messages
    
    // Detailed error logging from the previous advice
    if (error.response) {
      // Server responded with a status code out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      setErrorMessage(error.response.data.message || "Error updating user.");
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
      setErrorMessage("The request was made but no response was received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      setErrorMessage('Error' + error.message);
    }
  }
};

  const mapRoleIdToRole = (roleId) => {
    const role = roles.find((r) => r.roleID === roleId);
    return role ? role.roleName : "Not Assigned";
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

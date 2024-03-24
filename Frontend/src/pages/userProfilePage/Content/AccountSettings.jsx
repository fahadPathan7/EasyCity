/* eslint-disable react/prop-types */
import { FormControl, FormLabel, Grid, Input, Select } from "@chakra-ui/react";

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

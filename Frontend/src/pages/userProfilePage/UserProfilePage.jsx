import SimpleBar from "simplebar-react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./helpers";
import Cover from "./Cover";
import Main from "./Main";
import "./UserProfilePage.css";
// import { useLocation } from "react-router-dom";
import DefaultLayout from "../../components/defaultLayout/DefaultLayout";

export default function UserProfilePage() {
  // const location = useLocation();
  // const userData = location.state ? location.state.userData : null;
  return (
    <DefaultLayout>
      
        <ChakraProvider theme={theme}>
          <Cover  />
          <Main  />
        </ChakraProvider>
     
    </DefaultLayout>
  );
}

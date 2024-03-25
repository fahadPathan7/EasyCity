import SimpleBar from "simplebar-react";
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './helpers'
import Cover from './Cover'
import Main from './Main'
import './UserProfilePage.css'
import { useLocation } from 'react-router-dom';
export default function UserProfilePage() {
    const location = useLocation();
    
    const userData = location.state ? location.state.userData : null;
    return (
            <SimpleBar style={{ maxHeight: "100vh" }}>
                    <ChakraProvider theme={theme}>
                        <Cover userData={userData}/>
                        <Main userData={userData}/>
                </ChakraProvider>

        </SimpleBar>
    );
}

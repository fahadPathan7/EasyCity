import { Container } from '@chakra-ui/layout'
import Content from './Content/Content'
import Sidebar from './Sidebar/Sidebar'
import './UserProfilePage.css'

// eslint-disable-next-line react/prop-types
export default function Main({ userData }) {
  return (
    <Container display={{ base: 'block', md: 'flex' }} maxW="container.xl">
      <Sidebar userData={userData}/>
      <Content userData={userData}/>
    </Container>
  )
}

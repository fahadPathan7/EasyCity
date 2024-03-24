/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react'

import Actions from './Actions'
import Data from './Data'
import Profile from './Profile'


function Sidebar({ userData}) {
  return (
    <Box
      as="aside"
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="brand.light"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Profile userData={userData}/>
      <Data userData={userData}/>
      <Actions userData={userData}/>
    </Box>
  )
}

export default Sidebar

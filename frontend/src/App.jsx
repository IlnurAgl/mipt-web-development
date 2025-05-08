import { Center, Flex, Text, Box, Heading, Grid, SimpleGrid } from '@chakra-ui/react'
import NavBar from './NavBar'
import { Outlet } from "react-router";
import Footer from './Footer'

function App() {
  return (
    <Center w="100%">
      <Box w="100%">
        <NavBar />
        <Outlet />
        <br />
        <br />
        <br />
        <Footer />
      </Box>
    </Center>
  )
}

export default App

import { Center, Flex, Text, Box, Heading, Grid, SimpleGrid } from '@chakra-ui/react'
import NavBar from './NavBar'
import CardItem from './CardItem'
import Footer from './Footer'

function App() {
  return (
    <Center w="100%">
      <Box w="100%">
        <NavBar />
        <Center>
        <Box w="90%">
          <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">Лампочки</Heading>
          <SimpleGrid  p="0px 0px 30px 0px" minChildWidth="30%" spacing="100px" minH="full" gap="40px">
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
            <CardItem />
          </SimpleGrid>
        </Box>
        </Center>
        <Footer />
      </Box>
    </Center>
  )
}

export default App

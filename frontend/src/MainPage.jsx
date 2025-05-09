import { Center, Flex, Text, Box, Heading, Grid, SimpleGrid } from '@chakra-ui/react'
import CardItem from './CardItem'

export default function MainPage() {
    return (
      <Box>
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
      </Box>
    );
}
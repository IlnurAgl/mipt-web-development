import { Box, Flex, Heading, Center, Link }  from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box w={"100%"} bg="gray.100" minH="60px" alignContent={'center'} position={'absolute'} bottom='0'>  
      <Center>
        <Box w={"90%"} alignContent={'center'}>
          <Flex justify={'space-between'} align={'center'}>
            <Heading>Лампочки.ру</Heading>
            <Link href="/info"><Heading>О нас</Heading></Link>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
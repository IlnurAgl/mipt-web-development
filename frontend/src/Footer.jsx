import { Box, Flex, Heading, Center }  from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box w={"100%"} bg="gray.100" minH="60px" alignContent={'center'}>  
      <Center>
        <Box w={"90%"} alignContent={'center'}>
          <Flex justify={'space-between'} align={'center'}>
            <Heading>Лампочки.ру</Heading>
            <Heading>О нас</Heading>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
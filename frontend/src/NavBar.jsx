import { Box, Flex, Heading, Center }  from '@chakra-ui/react';
import { FaPhone } from "react-icons/fa6";
import { HiMiniShoppingCart } from "react-icons/hi2";

export default function NavBar() {
  return (
  <Box w={"100%"} bg="gray.100">  
    <Center>
      <Flex w="90%" gap="28px" p="0px 0px 0px 0px" align={"center"} justify={'space-between'} direction={{ base: 'column', md: 'row' }}>
        <Heading fontWeight="bold">Магазин лампочек</Heading>
        <Flex align={"center"} gap="20px">
          <FaPhone size="48px" fontWeight="bold"/>
          <Heading fontWeight="bold">+70000000000</Heading>
        </Flex>
        <Flex align={"center"} gap="20px">
          <HiMiniShoppingCart size="48px" fontWeight="bold"/>
          <Heading fontWeight="bold">1</Heading>
        </Flex>
      </Flex>
    </Center>
  </Box>
  );
}
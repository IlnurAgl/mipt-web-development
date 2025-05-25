import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Center, Link, IconButton, Button }  from '@chakra-ui/react';
import { FaPhone } from "react-icons/fa6";
import { HiMiniShoppingCart } from "react-icons/hi2";

export default function NavBar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith('cart_')) {
          count++;
        }
      }
      setCartCount(count);
    };

    updateCartCount();
    
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    }
  }, []);

  return (
  <Box w={"100%"} bg="gray.100">  
    <Center>
      <Flex w="90%" gap="28px" p="0px 0px 0px 0px" align={"center"} justify={'space-between'} direction={{ base: 'column', md: 'row' }}>
        <Heading fontWeight="bold"><Link href="/">Магазин лампочек</Link></Heading>
        <Flex align={"center"} gap="20px">
          <FaPhone size="48px" fontWeight="bold"/>
          <Heading fontWeight="bold">+70000000000</Heading>
        </Flex>
        <Flex align={"center"} gap="20px">
          <Button bg="gray.100" href="/cart" size="48px"><Link href="/cart"><HiMiniShoppingCart size="48px" color='#000000' href="/cart" /></Link></Button>
          <Heading fontWeight="bold">{cartCount}</Heading>
        </Flex>
      </Flex>
    </Center>
  </Box>
  );
}
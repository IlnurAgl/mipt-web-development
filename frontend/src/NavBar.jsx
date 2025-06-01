import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Center, Link, IconButton, Button }  from '@chakra-ui/react';
import { FaPhone } from "react-icons/fa6";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    const checkAuth = async () => {
      const token = getCookie('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8002/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username || '');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

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
        {isAuthenticated ? (
          <Flex align={"center"} gap="20px">
            <Heading fontWeight="bold">{username}</Heading>
            <Button bg="gray.100" href="/admin"><Link href="/admin"><Heading>Админская панель</Heading></Link></Button>
            <Button size="48px" onClick={() => {
              document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              setIsAuthenticated(false);
              navigate("/");
            }}><FiLogOut/></Button>
          </Flex>
        ) : (
          <>
            <Flex align={"center"} gap="20px">
              <FaPhone size="48px" fontWeight="bold"/>
              <Heading fontWeight="bold">+70000000000</Heading>
            </Flex>
            <Flex align={"center"} gap="20px">
              <Button bg="gray.100" href="/cart" size="48px"><Link href="/cart"><HiMiniShoppingCart size="48px" color='#000000' href="/cart" /></Link></Button>
              <Heading fontWeight="bold">{cartCount}</Heading>
            </Flex>
          </>
        )}
      </Flex>
    </Center>
  </Box>
  );
}
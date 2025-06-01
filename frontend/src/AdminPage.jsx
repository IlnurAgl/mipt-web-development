import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Button, Heading, Box, Center, Text } from '@chakra-ui/react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        navigate('/auth');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8002/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          setIsAuthenticated(false);
          navigate('/auth');
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <Box w="100%" p={4}>
      <Center>
        <Flex direction="column" gap={4} w="90%">
          <Heading mb={4}>Админская панель</Heading>
          <Button
            bg="gray.100"
            onClick={() => navigate('/admin/product')}
          >
            <Heading color="#000000">Управление товарами</Heading>
          </Button>
          <Button
            bg="gray.100"
            onClick={() => navigate('/admin/orders')}
          >
            <Heading color="#000000">Управление заказами</Heading>
          </Button>
        </Flex>
      </Center>
    </Box>
  )
}
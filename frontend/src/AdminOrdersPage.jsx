import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Center, Spinner, Grid, GridItem, Button, Flex } from '@chakra-ui/react';

export default function AdminOrdersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
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
        } else {
          setIsAuthenticated(true);
          fetchOrders(token);
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrders = async (token) => {
      try {
        const response = await fetch('http://127.0.0.1:8001/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return null; // Already redirected
  }

  return (
    <Box p={4}>
      <Center>
        <Box w="90%">
          {ordersLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Box borderWidth="1px" borderRadius="lg" p={4}>
              <Grid templateColumns="repeat(6, 1fr) 100px" gap={4} mb={4}>
                <GridItem><Text fontWeight="bold">ID</Text></GridItem>
                <GridItem><Text fontWeight="bold">Клиент</Text></GridItem>
                <GridItem><Text fontWeight="bold">Телефон</Text></GridItem>
                <GridItem><Text fontWeight="bold">Товары</Text></GridItem>
                <GridItem><Text fontWeight="bold">Адрес</Text></GridItem>
                <GridItem><Text fontWeight="bold">Статус</Text></GridItem>
                <GridItem><Text fontWeight="bold">Действия</Text></GridItem>
              </Grid>
              {orders.map((order) => (
                <Grid key={order.id} templateColumns="repeat(6, 1fr) 100px" gap={4} alignItems="center" py={2}>
                  <GridItem><Text>{order.id}</Text></GridItem>
                  <GridItem><Text>{order.customer_name}</Text></GridItem>
                  <GridItem><Text>{order.phone}</Text></GridItem>
                  <GridItem><Text>{order.goods ? Object.keys(order.goods).length : 0} товаров</Text></GridItem>
                  <GridItem><Text>{order.address}</Text></GridItem>
                  <GridItem>
                    <Text
                      color={order.status === 'active' ? 'green.500' : 'blue.500'}
                      fontWeight="medium"
                    >
                      {order.status === 'active' ? 'Активный' : 'Выполнен'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      w="full"
                      minW="90px"
                    >
                      Редактировать
                    </Button>
                  </GridItem>
                </Grid>
              ))}
            </Box>
          )}
        </Box>
      </Center>
    </Box>
  );
}
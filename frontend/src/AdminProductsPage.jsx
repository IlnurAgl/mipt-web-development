import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Image, Center, Spinner, Text, Grid, GridItem, Button, Flex } from '@chakra-ui/react';

export default function AdminProductsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
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
          fetchProducts(token);
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProducts = async (token) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
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
          <Flex justify="flex-end" mb={4}>
            <Button
              colorScheme="green"
              onClick={() => navigate('/admin/product/add')}
            >
              Создать товар
            </Button>
          </Flex>
          {productsLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Box borderWidth="1px" borderRadius="lg" p={4}>
              <Grid templateColumns="150px repeat(3, 1fr) 120px" gap={4} mb={4}>
                <GridItem><Text fontWeight="bold">Изображение</Text></GridItem>
                <GridItem><Text fontWeight="bold">Название</Text></GridItem>
                <GridItem><Text fontWeight="bold">Описание</Text></GridItem>
                <GridItem><Text fontWeight="bold">Цена</Text></GridItem>
                <GridItem><Text fontWeight="bold">Действия</Text></GridItem>
              </Grid>
              {products.map((product) => (
                <Grid key={product.id} templateColumns="150px repeat(3, 1fr) 120px" gap={4} alignItems="center">
                  <GridItem>
                    <Image
                      src={product.image_base64}
                      alt={product.name}
                      boxSize="100px"
                      objectFit="contain"
                    />
                  </GridItem>
                  <GridItem>
                    <Text>{product.name}</Text>
                  </GridItem>
                  <GridItem>
                    <Text>
                      {product.description ?
                        product.description.length > 100 ?
                          `${product.description.substring(0, 100)}...` :
                          product.description
                        : 'Нет описания'}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text>{product.price} ₽</Text>
                  </GridItem>
                  <GridItem>
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate(`/admin/product/${product.id}`)}
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
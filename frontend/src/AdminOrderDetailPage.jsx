import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Text, Center, Spinner, Grid, GridItem, Button, Flex, Link, Input, Field, Fieldset } from '@chakra-ui/react';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    goods: {},
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          fetchOrder(token);
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrder = async (token) => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
          setFormData({
            customer_name: data.customer_name,
            phone: data.phone,
            address: data.address,
            goods: {...data.goods},
            status: data.status
          });
          if (data.goods && typeof data.goods === 'object' && Object.keys(data.goods).length) {
            fetchProducts(token, data.goods);
          } else {
            console.log("Empty")
            setProductsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setOrderLoading(false);
      }
    };

    const fetchProducts = async (token, goods) => {
      try {
        const productIds = Object.keys(goods);
        const productRequests = productIds.map(id =>
          fetch(`http://127.0.0.1:8000/products/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        );
        
        const responses = await Promise.all(productRequests);
        const productsData = await Promise.all(
          responses.map(res => res.ok ? res.json() : null)
        );
        setProducts(productsData.filter(Boolean));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await fetch(`http://127.0.0.1:8001/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await fetch(`http://127.0.0.1:8001/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      navigate('/admin/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

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
        <Box w="90%" maxW="800px" borderWidth="1px" borderRadius="lg" p={4}>
          {orderLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            order ? (
              isEditing ? (
                <Flex as="form" direction="column" gap={4} onSubmit={handleSubmit}>
                  <Fieldset.Root>
                    <Fieldset.Content>
                      <Field.Root>
                        <Field.Label>Клиент</Field.Label>
                        <Input
                          name="customer_name"
                          value={formData.customer_name}
                          onChange={handleChange}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Телефон</Field.Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Адрес</Field.Label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Статус</Field.Label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #E2E8F0'
                          }}
                        >
                          <option value="active">Активный</option>
                          <option value="completed">Выполнен</option>
                        </select>
                      </Field.Root>
                      {productsLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <Text fontWeight="bold" mt={4}>Товары:</Text>
                          {products.map((product, index) => (
                            <Flex key={index} align="center" gap={2}>
                              <Text flex={1}>{product.name}</Text>
                              <Input
                                type="number"
                                min="1"
                                value={formData.goods[product.id] || 0}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  goods: {
                                    ...prev.goods,
                                    [product.id]: parseInt(e.target.value) || 0
                                  }
                                }))}
                                w="80px"
                              />
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => {
                                  setFormData(prev => {
                                    const newGoods = {...prev.goods};
                                    delete newGoods[product.id];
                                    return {
                                      ...prev,
                                      goods: newGoods
                                    };
                                  });
                                  setProducts(prev => prev.filter(p => p.id !== product.id));
                                }}
                              >
                                Удалить
                              </Button>
                            </Flex>
                          ))}
                        </>
                      )}
                    </Fieldset.Content>
                  </Fieldset.Root>
                  <Flex gap={4}>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                    >
                      Отмена
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <>
                  <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
                    <GridItem>
                      <Text fontWeight="bold">ID заказа:</Text>
                      <Text>{order.id}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">Статус:</Text>
                      <Text
                        color={order.status === 'active' ? 'green.500' : 'blue.500'}
                        fontWeight="medium"
                      >
                        {order.status === 'active' ? 'Активный' : 'Выполнен'}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">Клиент:</Text>
                      <Text>{order.customer_name}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">Телефон:</Text>
                      <Text>{order.phone}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">Адрес:</Text>
                      <Text>{order.address}</Text>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text fontWeight="bold">Товары:</Text>
                      {productsLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          {products.map((product, index) => {
                            const quantity = order.goods[product.id];
                            return (
                              <Text key={index}>
                                <Link href={`/admin/product/${product.id}`} color="blue.500">
                                  {product.name}
                                </Link> - {product.price} ₽ x {quantity}
                              </Text>
                            );
                          })}
                        </>
                      )}
                    </GridItem>
                  </Grid>
                  <Flex gap={4} wrap="wrap">
                    <Button
                      colorScheme="blue"
                      onClick={() => setIsEditing(true)}
                      flex="1"
                      minW="120px"
                    >
                      Редактировать
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDelete}
                      flex="1"
                      minW="120px"
                    >
                      Удалить
                    </Button>
                    <Button
                      onClick={() => navigate('/admin/orders')}
                      flex="1"
                      minW="120px"
                    >
                      Назад
                    </Button>
                  </Flex>
                </>
              )
            ) : (
              <Text>Заказ не найден</Text>
            )
          )}
        </Box>
      </Center>
    </Box>
  );
}
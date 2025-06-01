import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Image, Text, Center, Spinner, Button, Fieldset, Field, Input, Flex } from '@chakra-ui/react';

export default function AdminProductPage() {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_base64: ''
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
          fetchProduct(token);
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProduct = async (token) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            image_base64: data.image_base64
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setProductLoading(false);
      }
    };

    checkAuth();
  }, [navigate, id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image_base64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await fetch(`http://127.0.0.1:8000/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      navigate('/admin/product');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await fetch(`http://127.0.0.1:8000/products/${id}`, {
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

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={4}>
      <Center>
        <Box w="90%" maxW="800px" borderWidth="1px" borderRadius="lg" p={4}>
          {productLoading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : product ? (
            isEditing ? (
              <Flex as="form" direction="column" gap={4} onSubmit={handleSubmit}>
                <Fieldset.Root>
                  <Fieldset.Content>
                    <Field.Root>
                      <Field.Label>Название</Field.Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Описание</Field.Label>
                      <Input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Цена</Field.Label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Изображение</Field.Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {formData.image_base64 && (
                        <Image
                          src={formData.image_base64}
                          alt="Preview"
                          maxH="200px"
                          mt={2}
                        />
                      )}
                    </Field.Root>
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
                <Box mb={4}>
                  <Image
                    src={product.image_base64}
                    alt={product.name}
                    maxH="300px"
                    objectFit="contain"
                    mx="auto"
                  />
                </Box>
                <Box mb={4}>
                  <Text fontSize="xl" fontWeight="bold">Название: {product.name}</Text>
                </Box>
                <Box mb={4}>
                  <Text fontWeight="bold">Описание:</Text>
                  <Text>{product.description || 'Нет описания'}</Text>
                </Box>
                <Box mb={4}>
                  <Text fontWeight="bold">Цена: {product.price} ₽</Text>
                </Box>
                <Flex gap={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDelete}
                  >
                    Удалить
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/product')}
                  >
                    Назад к списку
                  </Button>
                </Flex>
              </>
            )
          ) : (
            <Text>Товар не найден</Text>
          )}
        </Box>
      </Center>
    </Box>
  );
}
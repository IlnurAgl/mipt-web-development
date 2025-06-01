import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Image, Center, Spinner, Button, Fieldset, Field, Input, Flex } from '@chakra-ui/react';

export default function AdminProductAddPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_base64: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await fetch('http://127.0.0.1:8000/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Create failed');
      }

      const resultProduct = await response.json();
      navigate(`/admin/product/${resultProduct.id}`);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={4}>
      <Center>
        <Box w="90%" maxW="800px" borderWidth="1px" borderRadius="lg" p={4}>
          <Flex as="form" direction="column" gap={4} onSubmit={handleSubmit}>
            <Fieldset.Root>
              <Fieldset.Content>
                <Field.Root>
                  <Field.Label>Название</Field.Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                    required
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
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
              >
                Создать
              </Button>
              <Button
                onClick={() => navigate('/admin/product')}
              >
                Отмена
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Center, Grid, GridItem, Box, Heading, Fieldset, Field, Input, Flex, Button, Text } from '@chakra-ui/react'
import CartItem from './CartItem'


export default function CartPage() {
  const [errors, setErrors] = useState({
    address: '',
    phone: '',
    fio: ''
  });

  const [cartError, setCartError] = useState('');

  const validateForm = () => {
    const newErrors = { address: '', phone: '', fio: '' };
    let isValid = true;

    if (cartItems.length === 0) {
      setCartError('Добавьте товары в корзину');
      isValid = false;
    } else {
      setCartError('');
    }

    const address = document.querySelector('input[name="address"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const fio = document.querySelector('input[name="fio"]').value;

    if (!address) {
      newErrors.address = 'Введите адрес доставки';
      isValid = false;
    }

    if (!phone) {
      newErrors.phone = 'Введите номер телефона';
      isValid = false;
    } else if (!/^\+[\d]{10,15}$/.test(phone.replace(/[^\d+]/g, ''))) {
      newErrors.phone = 'Введите корректный номер телефона';
      isValid = false;
    }

    if (!fio) {
      newErrors.fio = 'Введите ФИО';
      isValid = false;
    } else if (fio.split(' ').length < 3) {
      newErrors.fio = 'Введите полное ФИО (3 слова)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const goods = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cart_')) {
          const id = key.replace('cart_', '');
          goods[id] = parseInt(localStorage.getItem(key));
        }
      }

      try {
        const response = await axios.post('http://127.0.0.1:8001/orders', {
          customer_name: document.querySelector('input[name="fio"]').value,
          phone: document.querySelector('input[name="phone"]').value.replace(/[^\d+]/g, ''),
          goods: goods,
          address: document.querySelector('input[name="address"]').value
        });
        
        if (response.status === 200) {
          // Очищаем корзину после успешного заказа
          Object.keys(goods).forEach(id => {
            localStorage.removeItem(`cart_${id}`);
          });
          window.dispatchEvent(new Event('cartUpdated'));
          setCartItems([]);
          alert('Заказ успешно оформлен!');
        }
      } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Произошла ошибка при оформлении заказа');
      }
    }
  };
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const getCartItems = () => {
      const items = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cart_')) {
          const id = key.replace('cart_', '');
          const quantity = localStorage.getItem(key);
          items.push({ id, quantity });
        }
      }
      setCartItems(items);
    };
    getCartItems();
  }, []);

  return (
      <Box>
      <Center>
      <Flex w="90%" p="0 0 40px 0" gap="30px" direction={"column"}>
        <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">Корзина</Heading>
        <Grid gap="30px">
          {cartError && <Text color="red.500" fontSize="lg" textAlign="center">{cartError}</Text>}
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              id={item.id}
              quantity={item.quantity}
              onRemove={(id) => {
                localStorage.removeItem(`cart_${id}`);
                window.dispatchEvent(new Event('cartUpdated'));
                setCartItems(cartItems.filter(item => item.id !== id));
              }}
            />
          ))}
        </Grid>
        <Center>
        <Flex as="form" borderWidth="1px" p="30px" direction={"column"} gap="15px" onSubmit={handleSubmit}>
          <Fieldset.Root>
          <Fieldset.Content>
            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
            <GridItem>
              <Field.Root>
              <Field.Label fontSize="24px" font="Inter"><Heading>Адрес доставки:</Heading></Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Input name="address" />
              {errors.address && <Text color="red.500" fontSize="sm">{errors.address}</Text>}
            </GridItem>
            <GridItem>
              <Field.Root>
              <Field.Label fontSize="24px" font="Inter"><Heading>Номер телефона:</Heading></Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Input name="phone" />
              {errors.phone && <Text color="red.500" fontSize="sm">{errors.phone}</Text>}
            </GridItem>
            <GridItem>
              <Field.Root>
              <Field.Label fontSize="24px" font="Inter"><Heading>ФИО:</Heading></Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Input name="fio" />
              {errors.fio && <Text color="red.500" fontSize="sm">{errors.fio}</Text>}
            </GridItem>
            </Grid>
          </Fieldset.Content>
          </Fieldset.Root>
          <Button type="submit" alignSelf="center" onClick={handleSubmit}>Заказать</Button>
        </Flex>
        </Center>
      </Flex>
      </Center>
      </Box>
    );
  }
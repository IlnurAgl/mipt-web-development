import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Center, Grid, GridItem, Box, Heading, Fieldset, Field, Input, Flex, Button, Text } from '@chakra-ui/react'


export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [authError, setAuthError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      username: '',
      password: '',
    });
    setAuthError('');

    try {
      const response = await fetch('http://127.0.0.1:8002/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({
          username: errorData.detail?.username || '',
          password: errorData.detail?.password || ''
        });
        setAuthError('Неверный логин или пароль');
        throw new Error('Authorization failed');
      }

      const data = await response.json();
      Cookies.set('token', data.access_token);
      window.dispatchEvent(new Event('authStateChanged'));
      navigate('/admin');
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
    <Center>
      <Box>
      <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">Авторизация</Heading>
      <Flex as="form" borderWidth="1px" p="30px" direction={"column"} gap="15px" onSubmit={handleSubmit}>
        <Fieldset.Root>
        <Fieldset.Content>
          <Grid templateColumns="repeat(2, 1fr)" gap="20px">
          <GridItem>
            <Field.Root>
            <Field.Label fontSize="24px" font="Inter"><Heading>Логин:</Heading></Field.Label>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <Text color="red.500" fontSize="sm">{errors.username}</Text>}
          </GridItem>
          <GridItem>
            <Field.Root>
            <Field.Label fontSize="24px" font="Inter"><Heading>Пароль:</Heading></Field.Label>
            </Field.Root>
          </GridItem>
          <GridItem>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
          </GridItem>
          </Grid>
        </Fieldset.Content>
        </Fieldset.Root>
        {authError && <Text color="red.500" fontSize="sm" textAlign="center">{authError}</Text>}
        <Button type="submit" alignSelf="center" isLoading={loading}>Войти</Button>
      </Flex>
      </Box>
      </Center>
    </Box>
  );
}
import { Center, Flex, Text, Box, Heading, Grid, SimpleGrid, Spinner } from '@chakra-ui/react'
import CardItem from './CardItem'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MainPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchItems = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/products');
          console.log(response.data);
          setItems(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchItems();
    }, []);
    if (loading) return <Spinner size="xl" />;
    if (error) return <Text color="red.500">Error: {error}</Text>;
    return (
      <Box>
      <Center>
      <Box w="90%">
          <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">Лампочки</Heading>
          <SimpleGrid  p="0px 0px 30px 0px" minChildWidth="30%" spacing="100px" minH="full" gap="40px">
          {items.map(item => <CardItem id={item.id} image={item.image_base64} price={item.price} itemName={item.name}/>)}
          </SimpleGrid>
      </Box>
      </Center>
      </Box>
    );
}
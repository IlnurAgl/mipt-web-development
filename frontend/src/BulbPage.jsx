import { Center, Flex, Text, Box, Heading, NumberInput, Image } from '@chakra-ui/react'
import ImageCard from './assets/1.jpg'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiMiniShoppingCart } from "react-icons/hi2";
import { useParams } from 'react-router-dom';


export default function BulbPage() {
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
      window.localStorage.setItem(`cart_${id}`, quantity.toString());
      window.dispatchEvent(new Event('cartUpdated'));
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams()
    useEffect(() => {
      const fetchItems = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/products/${id}`);
          setItem(response.data);
        } catch (err) {
          setError(err.message);
          console.error('Error fetching product:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchItems();
    }, []);

    if (loading) return (
      <Center h="100vh">
        <Text fontSize="2xl">Loading...</Text>
      </Center>
    );

    if (error) return (
      <Center h="100vh">
        <Text color="red.500" fontSize="2xl">Error: {error}</Text>
      </Center>
    );

    return (
      <Box>
      <Center>
      <Box w="90%">
        <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">{item?.name}</Heading>
        <Flex direction={{ base: 'column', xl: 'row' }} gap="20px">
          <Image src={item?.image_base64} alt="test" rounded="8px 8px 0 0" />
          <Flex gap="20px" direction={"column"}>
            <Text>{item?.description}</Text>
            <Flex gap="10px">
              <Heading>Количество:</Heading>
              <NumberInput.Root min="1" width="200px" value={quantity} onValueChange={({ value }) => setQuantity(value)}>
                <NumberInput.Label />
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Scrubber />
                <NumberInput.Input />
              </NumberInput.Root>
              <HiMiniShoppingCart size="48px" fontWeight="bold" onClick={handleAddToCart} style={{ cursor: 'pointer' }}/>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      </Center>
      </Box>
    );
  }
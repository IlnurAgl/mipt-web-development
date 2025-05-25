import { useState, useEffect } from 'react';
import { Heading, Box, Text, Flex, Image, NumberInput, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import ImageCard from './assets/1.jpg'
import { HiMiniShoppingCart } from "react-icons/hi2";

export default function CartItem({ id, onRemove, product }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const storedQuantity = localStorage.getItem(`cart_${id}`);
    if (storedQuantity) {
      setQuantity(parseInt(storedQuantity));
    }
  }, [id]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
    localStorage.setItem(`cart_${id}`, value.toString());
    window.dispatchEvent(new Event('cartUpdated'));
  };
  return (
    <Flex gap="20px" direction={{ base: 'column', md: 'row' }} borderWidth="1px">
    <Box maxW="150px" borderWidth="1px" rounded="10px" minW="150px">
      <Image
        src={product?.image_base64 ? `${product.image_base64}` : ImageCard}
        alt={product?.name || 'Товар'}
        rounded="8px 8px 0 0"
      />
    </Box>
    <Flex align={"left"} direction="column" justify={"space-between"} gap="10px">
      <Link to={`/bulb/${id}`}>
        <Text fontSize="24px" _hover={{ textDecoration: 'underline' }}>
          {product?.name || 'Товар'}
        </Text>
      </Link>
      <Flex gap="20px" align={{ base: 'left', md: 'center' }} direction={{ base: 'column', md: 'row' }}>
        <Text fontSize="24px">Количество:</Text>
        <NumberInput.Root min="1" width="200px" value={quantity} onValueChange={({ value }) => handleQuantityChange(value)}>
          <NumberInput.Label />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
          <NumberInput.Scrubber />
          <NumberInput.Input />
        </NumberInput.Root>
      </Flex>
      <Text fontSize="24px">Цена за 1 шт: {product?.price || 0} руб</Text>
      <Button
        leftIcon={<FaTrash />}
        colorScheme="red"
        onClick={() => onRemove(id)}
        w="fit-content"
      >
        Удалить
      </Button>
    </Flex>
    </Flex>
  )
}
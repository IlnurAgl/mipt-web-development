import { useState } from 'react';
import { Icon, Box, Text, Flex, Image, Link, NumberInput, Button } from "@chakra-ui/react"
import ImageCard from './assets/1.jpg'
import { HiMiniShoppingCart } from "react-icons/hi2";
import { Buffer } from 'buffer';

export default function CardItem(data) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    window.localStorage.setItem(`cart_${data.id}`, quantity.toString());
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Box maxW="350px" borderWidth="1px" rounded="10px" minH="325px">
    <Image src={data.image} alt="image" rounded="8px 8px 0 0" />
    <Flex p='30px 40px 30px 20px' direction='column' gap='10px'>
      <Link fontSize={{ base: '18px', md: '24px' }} fontWeight="bold" href={"/bulb/" + data.id}>{data.itemName}</Link>
      <Flex justify={"space-between"} align={'center'} direction={{ base: 'column', md: 'row' }}>
        <Text>Цена: {data.price} руб</Text>
        <NumberInput.Root min="1" width="100px" value={quantity} onValueChange={({ value }) => setQuantity(value)}>
          <NumberInput.Label />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
          <NumberInput.Scrubber />
          <NumberInput.Input />
        </NumberInput.Root>
        <Button bg="white" size="48px" onClick={handleAddToCart}><HiMiniShoppingCart size="48px" color='#000000'/></Button>
      </Flex>
    </Flex>
    </Box>
  )
}
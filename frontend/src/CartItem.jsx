import { Heading, Box, Text, Flex, Image, Link, NumberInput } from "@chakra-ui/react"
import ImageCard from './assets/1.jpg'
import { HiMiniShoppingCart } from "react-icons/hi2";

export default function CartItem() {
  return (
    <Flex gap="20px" direction={{ base: 'column', md: 'row' }} borderWidth="1px">
    <Box maxW="150px" borderWidth="1px" rounded="10px" minW="150px">
    <Image src={ImageCard} alt="test" rounded="8px 8px 0 0" />
    </Box>
    <Flex align={"left"} direction="column" justify={"space-between"}>
      <Text fontSize="24px">Лампочка</Text>
      <Flex gap="20px" align={{ base: 'left', md: 'center' }} direction={{ base: 'column', md: 'row' }}>
        <Text fontSize="24px">Количество:</Text>
        <NumberInput.Root min="0" width="200px" defaultValue="10">
          <NumberInput.Label />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
          <NumberInput.Scrubber />
          <NumberInput.Input />
        </NumberInput.Root>
      </Flex>
      <Text fontSize="24px">Цена за 1 шт: 150 руб</Text>
    </Flex>
    </Flex>
  )
}
import { Icon, Box, Text, Flex, Image, Link, NumberInput } from "@chakra-ui/react"
import ImageCard from './assets/1.jpg'
import { HiMiniShoppingCart } from "react-icons/hi2";

export default function CardItem() {
  return (
    <Box maxW="350px" borderWidth="1px" rounded="10px" minH="325px">
    <Image src={ImageCard} alt="test" rounded="8px 8px 0 0" />
    <Flex p='30px 40px 30px 20px' direction='column' gap='10px'>
      <Link fontSize="24px" fontWeight="bold">Test</Link>
      <Flex justify={"space-between"} align={'center'} direction={{ base: 'column', md: 'row' }}>
        <Text>Цена: 100 руб</Text>
        <NumberInput.Root min="0" width="100px">
          <NumberInput.Label />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
          <NumberInput.Scrubber />
          <NumberInput.Input />
        </NumberInput.Root>
        <HiMiniShoppingCart size="48px" fontWeight="bold"/>
      </Flex>
    </Flex>
    </Box>
  )
}
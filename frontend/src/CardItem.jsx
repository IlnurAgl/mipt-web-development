import { Icon, Box, Text, Flex, Image, Link } from "@chakra-ui/react"
import { SlClock } from "react-icons/sl";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import ImageCard from './assets/1.jpg'

export default function CardItem() {
  return (
    <Box maxW="350px" borderWidth="1px" rounded="10px" minH="325px">
    <Image src={ImageCard} alt="test" rounded="8px 8px 0 0" />
    <Flex p='30px 40px 30px 20px' direction='column' gap='10px'>
      <Link fontSize="24px" fontWeight="bold">Test</Link>
      <Flex justify={"space-between"} align={'center'}>
        Test
      </Flex>
    </Flex>
    </Box>
  )
}
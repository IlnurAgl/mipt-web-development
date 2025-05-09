import { Center, Flex, Text, Box, Heading, NumberInput, Image } from '@chakra-ui/react'
import ImageCard from './assets/1.jpg'
import { HiMiniShoppingCart } from "react-icons/hi2";


export default function BulbPage() {
    return (
      <Box>
      <Center>
      <Box w="90%">
        <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">Название лампочки</Heading>
        <Flex direction={{ base: 'column', xl: 'row' }}>
          <Image src={ImageCard} alt="test" rounded="8px 8px 0 0" />
          <Flex gap="20px" direction={"column"}>
            <Text>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</Text>
            <Flex gap="10px">
              <Heading>Количество:</Heading>
              <NumberInput.Root min="0" width="200px">
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
        </Flex>
      </Box>
      </Center>
      </Box>
    );
  }
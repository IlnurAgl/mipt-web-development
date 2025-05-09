import { Center, Grid, GridItem, Box, Heading, Fieldset, Field, Input, Flex, Button } from '@chakra-ui/react'
import CartItem from './CartItem'


export default function BulbPage() {
    return (
      <Box>
      <Center>
      <Flex w="90%" p="0 0 40px 0" gap="30px" direction={"column"}>
        <Heading as="h1" fontSize="40px" fontWeight={"bold"} p="40px 0px 30px 0px">Корзина</Heading>
        <Grid gap="30px">
          <CartItem />
          <CartItem />
          <CartItem />
        </Grid>
        <Center>
        <Flex borderWidth="1px" p="30px" direction={"column"} gap="15px">
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
            </GridItem>
            <GridItem>
              <Field.Root>
              <Field.Label fontSize="24px" font="Inter"><Heading>Номер телефона:</Heading></Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Input name="phone" />
            </GridItem>
            <GridItem>
              <Field.Root>
              <Field.Label fontSize="24px" font="Inter"><Heading>ФИО:</Heading></Field.Label>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Input name="fio" />
            </GridItem>
            </Grid>
          </Fieldset.Content>
          </Fieldset.Root>
          <Button type="submit" alignSelf="center">Заказать</Button>  
        </Flex>
        </Center>
      </Flex>
      </Center>
      </Box>
    );
  }
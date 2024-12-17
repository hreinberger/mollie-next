import { Flex, Heading, Text, Card, Table } from '@radix-ui/themes';

export default async function ShoppingCart() {
    return (
        <>
            <Heading size="3">Your Shopping Cart</Heading>
            <Card m="1">
                <Flex direction="column">
                    <Table.Root>
                        <Table.Body>
                            <Table.Row>
                                <Table.ColumnHeaderCell>
                                    Product
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Quantity
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Price
                                </Table.ColumnHeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Flex direction="column">
                                        <Text>Product 1</Text>
                                        <Text
                                            size="1"
                                            color="gray"
                                        >
                                            Description
                                        </Text>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>200,00 €</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Flex direction="column">
                                        <Text>Product 2</Text>
                                        <Text
                                            size="1"
                                            color="gray"
                                        >
                                            Description
                                        </Text>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>10,00 €</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Flex direction="column">
                                        <Text>Product 3</Text>
                                        <Text
                                            size="1"
                                            color="gray"
                                        >
                                            Description
                                        </Text>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>10,00 €</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                    <Flex
                        align="center"
                        justify="center"
                        gap="2"
                        m="3"
                    >
                        <Heading size="2">Total</Heading>
                        <Heading size="2">220,00 €</Heading>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
}

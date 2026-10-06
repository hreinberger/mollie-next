'use client';

import { Flex, Heading, Text, Card, Table, Select } from '@radix-ui/themes';
import { useUrlSyncedState } from '@/app/lib/hooks';

// Currency symbols
const CURRENCY_SYMBOLS = {
    EUR: '€',
    SEK: 'kr',
    GBP: '£',
    USD: '$',
    CHF: 'fr',
};

// Product data
const PRODUCTS = [
    {
        id: 1,
        name: 'Product 1',
        description: 'An expensive product',
        quantity: 1,
        price: 200,
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'A cheap product',
        quantity: 1,
        price: 10,
    },
    {
        id: 3,
        name: 'Product 3',
        description: 'Another cheap product',
        quantity: 1,
        price: 10,
    },
];

export default function ShoppingCart() {
    const [currency, handleCurrencyChange] = useUrlSyncedState('currency', 'EUR');

    // Format price with the selected currency symbol
    const formatPrice = (price: number) => {
        const symbol =
            CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS];

        // Format based on currency style
        if (currency === 'GBP' || currency === 'USD') {
            return `${symbol}${price.toFixed(2).replace('.', ',')}`;
        } else {
            return `${price.toFixed(2).replace('.', ',')} ${symbol}`;
        }
    };

    // Calculate total
    const total = PRODUCTS.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    return (
        <>
            <Flex
                justify="between"
                align="center"
            >
                <Heading size="3">Your Shopping Cart</Heading>
                <Select.Root
                    value={currency}
                    onValueChange={handleCurrencyChange}
                    name="currency"
                    aria-label="Select currency"
                    defaultValue="EUR"
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="EUR">EUR (€)</Select.Item>
                        <Select.Separator />
                        <Select.Item value="SEK">SEK (kr)</Select.Item>
                        <Select.Item value="GBP">GBP (£)</Select.Item>
                        <Select.Item value="USD">USD ($)</Select.Item>
                        <Select.Item value="CHF">CHF (fr)</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>

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

                            {PRODUCTS.map((product) => (
                                <Table.Row key={product.id}>
                                    <Table.Cell>
                                        <Flex direction="column">
                                            <Text>{product.name}</Text>
                                            <Text
                                                size="1"
                                                color="gray"
                                            >
                                                {product.description}
                                            </Text>
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell>{product.quantity}</Table.Cell>
                                    <Table.Cell>
                                        {formatPrice(product.price)}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                    <Flex
                        align="center"
                        justify="center"
                        gap="2"
                        m="3"
                    >
                        <Heading size="2">Total</Heading>
                        <Heading size="2">{formatPrice(total)}</Heading>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
}

import {
    Flex,
    Heading,
    Text,
    Grid,
    Separator,
    TextField,
    Select,
    Switch,
} from '@radix-ui/themes';

export default async function Address() {
    return (
        <Flex
            direction="column"
            gap="2"
        >
            <Heading size="3">Billing Address</Heading>
            <Grid
                columns="2"
                gap="3"
                width="auto"
            >
                <Flex
                    direction="column"
                    gap="1"
                >
                    <Text as="label">Firstname</Text>
                    <TextField.Root
                        mb="2"
                        placeholder="Firstname"
                        defaultValue="Max"
                        name="firstname"
                        required
                    ></TextField.Root>
                </Flex>
                <Flex
                    direction="column"
                    gap="1"
                >
                    <Text as="label">Lastname</Text>
                    <TextField.Root
                        mb="2"
                        placeholder="Lastname"
                        defaultValue="Mustermensch"
                        name="lastname"
                        required
                    ></TextField.Root>
                </Flex>
            </Grid>
            <Flex
                direction="column"
                gap="1"
            >
                <Text as="label">Company Name</Text>
                <TextField.Root
                    mb="2"
                    placeholder="Company"
                    defaultValue="Mollie BV"
                    name="company"
                    required
                ></TextField.Root>
            </Flex>
            <Flex
                direction="column"
                gap="1"
            >
                <Text as="label">Email</Text>
                <TextField.Root
                    mb="2"
                    placeholder="test@example.com"
                    defaultValue="demo@example.com"
                    name="email"
                    required
                ></TextField.Root>
            </Flex>
            <Flex
                direction="column"
                gap="1"
            >
                <Text as="label">Address</Text>
                <TextField.Root
                    mb="2"
                    placeholder="Somestreet 123"
                    defaultValue="Alexanderstr. 36"
                    name="address"
                    required
                ></TextField.Root>
            </Flex>
            <Flex
                direction="column"
                gap="1"
            >
                <Text as="label">City</Text>
                <TextField.Root
                    mb="2"
                    placeholder="Berlin"
                    defaultValue="Berlin"
                    name="city"
                    required
                ></TextField.Root>
            </Flex>
            <Grid
                columns="2"
                gap="3"
                width="auto"
            >
                <Flex
                    direction="column"
                    gap="1"
                >
                    <Text as="label">Zip</Text>
                    <TextField.Root
                        mb="2"
                        placeholder="10179"
                        defaultValue="10179"
                        name="zip_code"
                        required
                    ></TextField.Root>
                </Flex>
                <Flex
                    direction="column"
                    gap="1"
                >
                    <Text as="label">Country</Text>
                    <Select.Root
                        defaultValue="DE"
                        name="country"
                        required
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Item value="DE">Germany</Select.Item>
                            <Select.Item value="AT">Austria</Select.Item>
                            <Select.Item value="NL">Netherlands</Select.Item>
                            <Select.Item value="UK">United Kingdom</Select.Item>
                            <Select.Item value="XI">
                                Northern Ireland (will error)
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
            </Grid>
            <Separator
                my="3"
                size="4"
            />
            <Heading
                size="3"
                mb="4"
            >
                Shipping Address
            </Heading>
            <Flex>
                <Text
                    as="label"
                    size="2"
                >
                    <Flex
                        gap="2"
                        direction="row"
                    >
                        <Switch
                            defaultChecked
                            radius="full"
                        />
                        Shipping address is the same as my billing address
                    </Flex>
                </Text>
            </Flex>
            <Separator
                my="3"
                size="4"
            />
        </Flex>
    );
}

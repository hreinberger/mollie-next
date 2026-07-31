import {
    Flex,
    Heading,
    Text,
    Grid,
    Separator,
    TextField,
    Switch,
    Callout,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import SelectCountry from './SelectCountry';
import { AddressSource } from '@/app/lib/types';

export default async function Address({
    addressSource,
}: {
    addressSource: AddressSource;
}) {
    return (
        <Flex
            direction="column"
            gap="2"
        >
            <Heading size="3">Billing Address</Heading>
            {addressSource === 'session' ? (
                <Callout.Root
                    color="blue"
                    size="1"
                >
                    <Callout.Icon>
                        <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>
                        Email and billing address will be collected by the
                        Express Checkout session instead of this form.
                    </Callout.Text>
                </Callout.Root>
            ) : (
                <>
                    <Grid
                        columns="2"
                        gap="3"
                        width="auto"
                    >
                        <Flex
                            direction="column"
                            gap="1"
                        >
                            <Text
                                as="label"
                                htmlFor="firstname"
                            >
                                Firstname
                            </Text>
                            <TextField.Root
                                mb="2"
                                placeholder="Firstname"
                                defaultValue="Max"
                                name="firstname"
                                id="firstname"
                                type="text"
                                required
                            ></TextField.Root>
                        </Flex>
                        <Flex
                            direction="column"
                            gap="1"
                        >
                            <Text
                                as="label"
                                htmlFor="lastname"
                            >
                                Lastname
                            </Text>
                            <TextField.Root
                                mb="2"
                                placeholder="Lastname"
                                defaultValue="Mustermensch"
                                name="lastname"
                                id="lastname"
                                type="text"
                                required
                            ></TextField.Root>
                        </Flex>
                    </Grid>
                    <Flex
                        direction="column"
                        gap="1"
                    >
                        <Text
                            as="label"
                            htmlFor="company"
                        >
                            Company Name
                        </Text>
                        <TextField.Root
                            mb="2"
                            placeholder="Company"
                            defaultValue="Mollie BV"
                            name="company"
                            id="company"
                            type="text"
                        ></TextField.Root>
                    </Flex>
                    <Flex
                        direction="column"
                        gap="1"
                    >
                        <Text
                            as="label"
                            htmlFor="email"
                        >
                            Email
                        </Text>
                        <TextField.Root
                            mb="2"
                            placeholder="test@example.com"
                            defaultValue="demo@example.com"
                            name="email"
                            id="email"
                            type="email"
                            required
                        ></TextField.Root>
                    </Flex>
                    <Flex
                        direction="column"
                        gap="1"
                    >
                        <Text
                            as="label"
                            htmlFor="address"
                        >
                            Address
                        </Text>
                        <TextField.Root
                            mb="2"
                            placeholder="Somestreet 123"
                            defaultValue="Alexanderstr. 36"
                            name="address"
                            id="address"
                            type="text"
                            required
                        ></TextField.Root>
                    </Flex>
                    <Flex
                        direction="column"
                        gap="1"
                    >
                        <Text
                            as="label"
                            htmlFor="city"
                        >
                            City
                        </Text>
                        <TextField.Root
                            mb="2"
                            placeholder="Berlin"
                            defaultValue="Berlin"
                            name="city"
                            id="city"
                            type="text"
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
                            <Text
                                as="label"
                                htmlFor="zip_code"
                            >
                                Zip
                            </Text>
                            <TextField.Root
                                mb="2"
                                placeholder="10179"
                                defaultValue="10179"
                                name="zip_code"
                                id="zip_code"
                                type="number"
                                required
                            ></TextField.Root>
                        </Flex>
                        <Flex
                            direction="column"
                            gap="1"
                        >
                            <SelectCountry />
                        </Flex>
                    </Grid>
                </>
            )}
            {addressSource === 'form' && (
                <>
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
                            htmlFor="shipping"
                        >
                            <Flex
                                gap="2"
                                direction="row"
                            >
                                <Switch
                                    defaultChecked
                                    radius="full"
                                    id="shipping"
                                    title="shipping"
                                />
                                Shipping address is the same as my billing
                                address
                            </Flex>
                        </Text>
                    </Flex>
                    <Separator
                        my="3"
                        size="4"
                    />
                </>
            )}
        </Flex>
    );
}

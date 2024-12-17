import {
    Card,
    Flex,
    RadioGroup,
    Separator,
    Text,
    Callout,
    Skeleton,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export default async function MethodsSkeleton() {
    return (
        <RadioGroup.Root>
            <Card m="1">
                <Flex direction="column">
                    <Flex
                        align="center"
                        justify="between"
                        gap="4"
                    >
                        <Text as="label">
                            <Skeleton>
                                <Flex
                                    gap="2"
                                    align="center"
                                >
                                    <RadioGroup.Item value="test" />
                                    Test Payment
                                </Flex>
                            </Skeleton>
                        </Text>
                        <Skeleton
                            width="32px"
                            height="24px"
                        ></Skeleton>
                    </Flex>
                    <Separator
                        my="3"
                        size="4"
                    />
                    <Flex
                        align="center"
                        justify="between"
                        gap="4"
                    >
                        <Text as="label">
                            <Skeleton>
                                <Flex
                                    gap="2"
                                    align="center"
                                >
                                    <RadioGroup.Item value="test" />
                                    Test Payment
                                </Flex>
                            </Skeleton>
                        </Text>
                        <Skeleton
                            width="32px"
                            height="24px"
                        ></Skeleton>
                    </Flex>
                    <Separator
                        my="3"
                        size="4"
                    />
                    <Flex
                        align="center"
                        justify="between"
                        gap="4"
                    >
                        <Text as="label">
                            <Skeleton>
                                <Flex
                                    gap="2"
                                    align="center"
                                >
                                    <RadioGroup.Item value="test" />
                                    Test Payment
                                </Flex>
                            </Skeleton>
                        </Text>
                        <Skeleton
                            width="32px"
                            height="24px"
                        ></Skeleton>
                    </Flex>
                    <Separator
                        my="3"
                        size="4"
                    />
                    <Flex
                        align="center"
                        justify="between"
                        gap="4"
                    >
                        <Text as="label">
                            <Skeleton>
                                <Flex
                                    gap="2"
                                    align="center"
                                >
                                    <RadioGroup.Item value="test" />
                                    Test Payment
                                </Flex>
                            </Skeleton>
                        </Text>
                        <Skeleton
                            width="32px"
                            height="24px"
                        ></Skeleton>
                    </Flex>
                    <Separator
                        my="3"
                        size="4"
                    />
                    <Flex
                        align="center"
                        justify="between"
                        gap="4"
                    >
                        <Text as="label">
                            <Skeleton>
                                <Flex
                                    gap="2"
                                    align="center"
                                >
                                    <RadioGroup.Item value="test" />
                                    Test Payment
                                </Flex>
                            </Skeleton>
                        </Text>
                        <Skeleton
                            width="32px"
                            height="24px"
                        ></Skeleton>
                    </Flex>
                    <Separator
                        my="3"
                        size="4"
                    />
                    <Skeleton>
                        <Callout.Root>
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>Test Mode only!</Callout.Text>
                        </Callout.Root>
                    </Skeleton>
                </Flex>
            </Card>
        </RadioGroup.Root>
    );
}

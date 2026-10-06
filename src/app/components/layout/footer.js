import Link from 'next/link';
import { Text, Flex } from '@radix-ui/themes';

export default function Footer() {
    return (
        <Flex
            direction="column"
            align="center"
            gap="2"
            pb="4"
            className="max-sm:hidden"
        >
            <Text
                size="1"
                color="gray"
                className="font-light"
            >
                This site is not part of Mollie's official product offering. Use
                at your own risk.
            </Text>
            <Link href="https://github.com/hreinberger/mollie-next">
                <Text
                    size="1"
                    color="gray"
                    className="font-light"
                >
                    Github Repo
                </Text>
            </Link>
        </Flex>
    );
}

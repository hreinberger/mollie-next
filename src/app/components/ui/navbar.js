'use client';

import Link from 'next/link';
import { Text, Code, Flex, Avatar } from '@radix-ui/themes';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import MollieLogo from './mollielogo';

export default function Navbar({ user }) {
    const pathname = usePathname();

    return (
        <Flex
            asChild="true"
            justify="between"
            align="center"
            m="4"
        >
            <header>
                <Link href="/">
                    <Flex
                        gap="2"
                        align="center"
                    >
                        <MollieLogo className="h-6 w-6" />
                        <Text
                            size={{
                                initial: '1',
                                xs: '2',
                                md: '3',
                                xl: '4',
                            }}
                            className="font-light max-sm:hidden"
                            color="gray"
                        >
                            Checkout Demo
                        </Text>
                    </Flex>
                </Link>
                <nav className="flex gap-6 items-center">
                    <Link href="/checkout">
                        <Text
                            size={{
                                initial: '1',
                                xs: '2',
                                md: '3',
                                xl: '4',
                            }}
                            className={clsx(
                                'transition-all duration-100',
                                pathname === '/checkout'
                                    ? 'font-bold'
                                    : 'font-medium',
                            )}
                        >
                            Checkout
                        </Text>
                    </Link>
                    <Link href="/payments">
                        <Text
                            size={{
                                initial: '1',
                                xs: '2',
                                md: '3',
                                xl: '4',
                            }}
                            className={clsx(
                                'transition-all duration-100',
                                pathname === '/payments'
                                    ? 'font-bold'
                                    : 'font-medium',
                            )}
                        >
                            Payments
                        </Text>
                    </Link>
                    {user ? (
                        <Flex
                            align="center"
                            gap="2"
                        >
                            <Avatar
                                size="1"
                                src={user.picture}
                                fallback={user.name?.[0] ?? '?'}
                                radius="full"
                            />
                            <a href="/api/auth/logout">
                                <Text
                                    size={{
                                        initial: '1',
                                        xs: '2',
                                        md: '3',
                                        xl: '4',
                                    }}
                                >
                                    <Code color="gray" style={{ fontFamily: 'inherit' }}>Sign out</Code>
                                </Text>
                            </a>
                        </Flex>
                    ) : (
                        <a href="/api/auth/login">
                            <Text
                                size={{
                                    initial: '1',
                                    xs: '2',
                                    md: '3',
                                    xl: '4',
                                }}
                            >
                                <Code style={{ fontFamily: 'inherit' }}>Sign in</Code>
                            </Text>
                        </a>
                    )}
                </nav>
            </header>
        </Flex>
    );
}

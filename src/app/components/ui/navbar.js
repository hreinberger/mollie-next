'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { Text, Code, Flex, Avatar } from '@radix-ui/themes';

import MollieLogo from './mollielogo';
import NavLinkLabel from './navlinklabel';

// Deterministic Suspense fallback for NavLinkLabel — same size/weight as the
// non-active state, since the active pathname isn't known in the static shell.
function NavLinkLabelFallback({ children }) {
    return (
        <Text
            size={{
                initial: '1',
                xs: '2',
                md: '3',
                xl: '4',
            }}
            className="transition-all duration-100 font-medium"
        >
            {children}
        </Text>
    );
}

export default function Navbar({ user }) {
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
                        <Suspense
                            fallback={
                                <NavLinkLabelFallback>
                                    Checkout
                                </NavLinkLabelFallback>
                            }
                        >
                            <NavLinkLabel href="/checkout">
                                Checkout
                            </NavLinkLabel>
                        </Suspense>
                    </Link>
                    <Link href="/payments">
                        <Suspense
                            fallback={
                                <NavLinkLabelFallback>
                                    Payments
                                </NavLinkLabelFallback>
                            }
                        >
                            <NavLinkLabel href="/payments">
                                Payments
                            </NavLinkLabel>
                        </Suspense>
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
                                    <Code
                                        color="gray"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        Sign out
                                    </Code>
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
                                <Code style={{ fontFamily: 'inherit' }}>
                                    Sign in
                                </Code>
                            </Text>
                        </a>
                    )}
                </nav>
            </header>
        </Flex>
    );
}

'use client';

import Link from 'next/link';
import { Text, Code, Flex } from '@radix-ui/themes';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import MollieLogo from './mollielogo';

export default function Navbar() {
  const pathname = usePathname();
  console.log('navigated to:' + pathname);

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
        <nav className="flex gap-6">
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
                pathname === '/checkout' ? 'font-bold' : 'font-medium'
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
                pathname === '/payments' ? 'font-bold' : 'font-medium'
              )}
            >
              Payments
            </Text>
          </Link>
          <Link href="/express">
            <Text
              size={{
                initial: '1',
                xs: '2',
                md: '3',
                xl: '4',
              }}
              className={clsx(
                'transition-all duration-100',
                pathname === '/express' ? 'font-bold' : 'font-medium'
              )}
            >
              Express Component
            </Text>
          </Link>
          <Link
            href="https://github.com/hreinberger/mollie-next"
            className="max-sm:hidden"
          >
            <Text
              size={{
                initial: '1',
                xs: '2',
                md: '3',
                xl: '4',
              }}
            >
              <Code>Github Repo</Code>
            </Text>
          </Link>
        </nav>
      </header>
    </Flex>
  );
}

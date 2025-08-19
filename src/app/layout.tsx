import type { Metadata } from 'next';
import './globals.css';
import { Theme, ThemePanel, Container, Section } from '@radix-ui/themes';

import Navbar from '@/app/components/ui/navbar.js';
import Footer from '@/app/components/ui/footer.js';
import { Providers } from '@/app/components/ui/providers.jsx';
import Script from 'next/script';

import { MollieProvider } from './lib/MollieContext';

export const metadata: Metadata = {
    title: 'Mollie Demo App',
    description: 'A demo app for Mollie payments, written in next.js',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body>
                <Providers>
                    <Theme
                        accentColor="blue"
                        grayColor="gray"
                        panelBackground="solid"
                        scaling="100%"
                        radius="large"
                    >
                        {/* <ThemePanel /> */}
                        <Container size="4">
                            <Section
                                pt="0"
                                pb="4"
                            >
                                <Navbar />
                            </Section>
                            <Section
                                pt="4"
                                pb="4"
                            >
                                <MollieProvider>{children}</MollieProvider>
                            </Section>
                            <Section
                                pt="4"
                                pb="0"
                            >
                                <Footer />
                            </Section>
                        </Container>
                    </Theme>
                </Providers>
                <Script
                    src="https://plausible.hannesreinberger.de/js/script.js"
                    data-domain="mollie-next.vercel.app"
                />
                <Script
                    strategy="beforeInteractive"
                    src="https://js.mollie.com/v1/mollie.js"
                />
                <Script
                    strategy="beforeInteractive"
                    src="https://js.mollie.com/v2/mollie.js?compatible"
                />
            </body>
        </html>
    );
}

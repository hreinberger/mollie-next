'use client';

import { RocketIcon } from '@radix-ui/react-icons';
import { Callout, Flex, Heading, Em, Badge } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { mollieGetLatestPaymentStatus } from '../lib/mollie';
import StateBadge from '../components/ui/orderstatebadge';

// Dynamically import the confetti component to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function Page() {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    // Fetch payment status
    useEffect(() => {
        async function getStatus() {
            const status = await mollieGetLatestPaymentStatus();
            setPaymentStatus(status);
        }
        getStatus();
    }, []);

    // Green color palette for confetti
    const greenColors = [
        '#1a5d1a', // Dark Forest Green
        '#38a169', // Forest Green
        '#48bb78', // Green
        '#68d391', // Light Green
        '#9ae6b4', // Pale Green
        '#c6f6d5', // Mint Green
        '#22c55e', // Emerald Green
        '#86efac', // Spring Green
    ];

    // Handle window resizing
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Stop confetti after 9.5 seconds
    useEffect(() => {
        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 9500);

        return () => clearTimeout(confettiTimer);
    }, []);

    // Redirect to checkout after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/checkout');
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main>
            {showConfetti && (
                <ReactConfetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={150}
                    recycle={false}
                    gravity={0.15}
                    tweenDuration={5000}
                    initialVelocityY={10}
                    colors={greenColors}
                />
            )}
            <Flex
                direction="column"
                m="6"
            >
                <Heading>Thank You for your order!</Heading>
                <Flex
                    align="center"
                    mt="2"
                    gap="2"
                >
                    Your payment status is:{' '}
                    {paymentStatus && (
                        <StateBadge state={paymentStatus || 'loading...'} />
                    )}
                </Flex>
                <Flex
                    align="center"
                    justify="center"
                    mt="4"
                >
                    <Callout.Root
                        size="3"
                        color="green"
                    >
                        <Callout.Icon>
                            <RocketIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Thank you for your order! You'll be redirected to
                            the checkout soon to pay <Em>even more!</Em>
                        </Callout.Text>
                    </Callout.Root>
                </Flex>
            </Flex>
        </main>
    );
}

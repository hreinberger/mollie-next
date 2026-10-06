import { Flex, Heading, Skeleton } from '@radix-ui/themes';

// Shared loading.tsx body for any "[id]" detail route.
export default function DetailSkeleton({ heading }: { heading: string }) {
    return (
        <main>
            <Flex direction="column" m="6">
                <Heading>{heading}</Heading>
                <Flex direction="column" gap="4" pt="4">
                    <Skeleton height="320px" />
                </Flex>
            </Flex>
        </main>
    );
}

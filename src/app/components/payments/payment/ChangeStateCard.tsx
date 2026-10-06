import { Button, Card, Flex, Heading, Separator } from '@radix-ui/themes';

export default function ChangeStateCard({ changePaymentStateUrl }: { changePaymentStateUrl: string }) {
    return (
        <Card>
            <Heading size="3" mb="3">
                Payment State
            </Heading>
            <Separator my="3" size="4" />
            <Flex justify="end">
                <Button variant="soft" asChild>
                    <a href={changePaymentStateUrl}>Change Payment State</a>
                </Button>
            </Flex>
        </Card>
    );
}

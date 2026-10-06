import { Box, Card, ScrollArea, Text } from '@radix-ui/themes';

// A collapsible "raw API data" card, used at the bottom of detail pages for
// debugging/support purposes.
export default function RawJsonDump({
    label,
    data,
}: {
    label: string;
    data: unknown;
}) {
    return (
        <Card>
            <details>
                <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <Text size="3" weight="bold">
                        {label}
                    </Text>
                </summary>
                <Box
                    mt="3"
                    p="3"
                    style={{
                        background: 'var(--gray-a2)',
                        borderRadius: 'var(--radius-2)',
                    }}
                >
                    <ScrollArea style={{ maxHeight: 600 }}>
                        <Text size="1">
                            <pre
                                style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </Text>
                    </ScrollArea>
                </Box>
            </details>
        </Card>
    );
}

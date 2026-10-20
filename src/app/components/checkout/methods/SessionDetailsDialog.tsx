'use client';

import {
    Button,
    Code,
    DataList,
    Dialog,
    Separator,
    Text,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { ExpressSession } from '@/app/lib/types';
import { formatAmount, formatDateTime } from '@/app/lib/format';
import RawJsonDump from '@/app/components/shared/RawJsonDump';

// Unobtrusive trigger + dialog for inspecting the Checkout Session backing
// the active Components v2 widgets. Hidden entirely when there's no session
// (e.g. visitors who aren't signed in with a @mollie.com account).
export default function SessionDetailsDialog({
    session,
}: {
    session: ExpressSession | null;
}) {
    if (!session) {
        return null;
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button
                    type="button"
                    size="1"
                    variant="ghost"
                    color="gray"
                >
                    <InfoCircledIcon /> View session data
                </Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="560px">
                <Dialog.Title>Session data</Dialog.Title>
                <Dialog.Description size="2" color="gray" mb="4">
                    The Checkout Session backing the active Components v2
                    widgets.
                </Dialog.Description>

                <DataList.Root>
                    <DataList.Item align="center">
                        <DataList.Label>ID</DataList.Label>
                        <DataList.Value>
                            <Code variant="ghost">{session.id}</Code>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Status</DataList.Label>
                        <DataList.Value>{session.status}</DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Mode</DataList.Label>
                        <DataList.Value>{session.mode}</DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Amount</DataList.Label>
                        <DataList.Value>
                            {formatAmount(session.amount)}
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Created At</DataList.Label>
                        <DataList.Value>
                            {formatDateTime(session.createdAt)}
                        </DataList.Value>
                    </DataList.Item>
                    {session.expiredAt && (
                        <DataList.Item>
                            <DataList.Label>Expired At</DataList.Label>
                            <DataList.Value>
                                {formatDateTime(session.expiredAt)}
                            </DataList.Value>
                        </DataList.Item>
                    )}
                    {session.completedAt && (
                        <DataList.Item>
                            <DataList.Label>Completed At</DataList.Label>
                            <DataList.Value>
                                {formatDateTime(session.completedAt)}
                            </DataList.Value>
                        </DataList.Item>
                    )}
                    <DataList.Item>
                        <DataList.Label>Redirect URL</DataList.Label>
                        <DataList.Value>
                            <Text size="2" style={{ wordBreak: 'break-all' }}>
                                {session.redirectUrl}
                            </Text>
                        </DataList.Value>
                    </DataList.Item>
                </DataList.Root>

                <Separator size="4" my="4" />

                <RawJsonDump label="Raw Session Data" data={session} />
            </Dialog.Content>
        </Dialog.Root>
    );
}

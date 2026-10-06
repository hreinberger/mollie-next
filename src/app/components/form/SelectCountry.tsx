'use client';

import { Select, Text } from '@radix-ui/themes';
import { useUrlSyncedState } from '@/app/lib/hooks';

export default function SelectCountry() {
    const [country, handleCountryChange] = useUrlSyncedState('country', 'DE');

    return (
        <>
            <Text as="label">Country</Text>
            <Select.Root
                value={country}
                onValueChange={handleCountryChange}
                defaultValue="DE"
                name="country"
                aria-label="Country"
                required
            >
                <Select.Trigger />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>EUR</Select.Label>
                        <Select.Item
                            value="DE"
                            id="DE"
                            aria-label="Germany"
                        >
                            🇩🇪 Germany
                        </Select.Item>
                        <Select.Item
                            value="AT"
                            id="AT"
                            aria-label="Austria"
                        >
                            🇦🇹 Austria
                        </Select.Item>
                        <Select.Item
                            value="NL"
                            id="NL"
                            aria-label="Netherlands"
                        >
                            🇳🇱 Netherlands
                        </Select.Item>
                        <Select.Item
                            value="FR"
                            id="FR"
                            aria-label="France"
                        >
                            🇫🇷 France
                        </Select.Item>
                        <Select.Item
                            value="PT"
                            id="PT"
                            aria-label="Portugal"
                        >
                            🇵🇹 Portugal
                        </Select.Item>
                        <Select.Item
                            value="IT"
                            id="IT"
                            aria-label="Italy"
                        >
                            🇮🇹 Italy
                        </Select.Item>
                        <Select.Item
                            value="ES"
                            id="ES"
                            aria-label="Spain"
                        >
                            🇪🇸 Spain
                        </Select.Item>
                    </Select.Group>
                    <Select.Group>
                        <Select.Label>Other currencies</Select.Label>
                        <Select.Item
                            value="GB"
                            id="GB"
                            aria-label="United Kingdom"
                        >
                            🇬🇧 United Kingdom
                        </Select.Item>
                        <Select.Item
                            value="SE"
                            id="SE"
                            aria-label="Sweden"
                        >
                            🇸🇪 Sweden
                        </Select.Item>

                        <Select.Item
                            value="CH"
                            id="CH"
                            aria-label="Switzerland"
                        >
                            🇨🇭 Switzerland
                        </Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </>
    );
}

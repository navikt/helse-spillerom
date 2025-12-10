import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { StartBehandling } from '@components/saksbilde/start-behandling/StartBehandling'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <Tabs defaultValue="start-behandling">
                <TabsList>
                    <TabsTab value="start-behandling" label="Start behandling" />
                </TabsList>
                <StartBehandling value="start-behandling" />
            </Tabs>
        </section>
    )
}

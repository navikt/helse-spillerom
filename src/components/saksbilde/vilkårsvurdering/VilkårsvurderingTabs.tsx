'use client'

import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab, TabsPanel } from '@navikt/ds-react/Tabs'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Vilkårsvurdering } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { VilkårsvurderingV2 } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingV2'

export function VilkårsvurderingTabs({ value }: { value: string }): ReactElement {
    return (
        <SaksbildePanel value={value}>
            <Tabs defaultValue="ny">
                <TabsList>
                    <TabsTab value="ny" label="Vilkårsvurdering" />
                    <TabsTab value="gammel" label="Gammel versjon" />
                </TabsList>
                <TabsPanel value="ny">
                    <VilkårsvurderingV2 />
                </TabsPanel>
                <TabsPanel value="gammel">
                    <Vilkårsvurdering />
                </TabsPanel>
            </Tabs>
        </SaksbildePanel>
    )
}

'use client'

import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { VilkårsvurderingTab } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTab'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { SaksbehandlingsperiodeHeading } from '@components/saksbilde/SaksbehandlingsperiodeHeading'
import { YrkesaktivitetTab } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetTab'
import { useHash } from '@hooks/useHash'
import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'

const VALID_TABS = ['yrkesaktivitet', 'sykepengegrunnlag', 'nysykepengegrunnlag', 'vilkar', 'dagoversikt'] as const
const DEFAULT_TAB = 'yrkesaktivitet'

function validTabOrDefault(tab?: string) {
    if (tab && VALID_TABS.includes(tab as (typeof VALID_TABS)[number])) {
        return tab
    }
    return DEFAULT_TAB
}

export default function PersonPage(): ReactElement {
    const hash = useHash()
    const activeTab = validTabOrDefault(hash)

    const handleTabChange = (newTab: string) => (window.location.hash = newTab)

    return (
        <section className="flex-auto">
            <SaksbehandlingsperiodeHeading />
            <Tabs value={activeTab} onChange={handleTabChange}>
                <TabsList>
                    <TabsTab value="yrkesaktivitet" label="Yrkesaktivitet" />
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkar" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <YrkesaktivitetTab value="yrkesaktivitet" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <VilkårsvurderingTab value="vilkar" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

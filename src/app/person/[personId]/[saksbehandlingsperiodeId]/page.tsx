'use client'

import { ReactElement } from 'react'
import { ActionMenu, Button, Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'
import { ChevronDownIcon } from '@navikt/aksel-icons'

import { VilkårsvurderingTab } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTab'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { SaksbehandlingsperiodeHeading } from '@components/saksbilde/SaksbehandlingsperiodeHeading'
import { YrkesaktivitetTab } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetTab'
import { useHash } from '@hooks/useHash'
import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { InntekterTilFordelingTab } from '@components/saksbilde/inntekter-til-fordeling/InntekterTilFordelingTab'

const VALID_TABS = [
    'yrkesaktivitet',
    'sykepengegrunnlag',
    'nysykepengegrunnlag',
    'vilkar',
    'dagoversikt',
    'inntekter-fordeling',
] as const
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
                    <ActionMenu>
                        <ActionMenu.Trigger className="ml-8">
                            <Button variant="secondary" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                                Meny
                            </Button>
                        </ActionMenu.Trigger>
                        <ActionMenu.Content>
                            <ActionMenu.Group label="Spesialverktøy">
                                <ActionMenu.Item
                                    onSelect={() => {
                                        handleTabChange('inntekter-fordeling')
                                    }}
                                >
                                    Inntekter til fordeling
                                </ActionMenu.Item>
                            </ActionMenu.Group>
                        </ActionMenu.Content>
                    </ActionMenu>
                </TabsList>
                <YrkesaktivitetTab value="yrkesaktivitet" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <VilkårsvurderingTab value="vilkar" />
                <Dagoversikt value="dagoversikt" />
                <InntekterTilFordelingTab value="inntekter-fordeling" />
            </Tabs>
        </section>
    )
}

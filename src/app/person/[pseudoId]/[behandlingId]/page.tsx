'use client'

import { ReactElement } from 'react'
import { ActionMenu, HStack, Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'
import { ChevronDownIcon } from '@navikt/aksel-icons'

import { VilkårsvurderingTab } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTab'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { BehandlingHeading } from '@components/saksbilde/BehandlingHeading'
import { YrkesaktivitetTab } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetTab'
import { useHash } from '@hooks/useHash'
import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { RefusjonTab } from '@components/saksbilde/refusjon/RefusjonTab'
import { FrihåndSykepengegrunnlagTab } from '@components/saksbilde/frihand-sykepengegrunnlag/FrihåndSykepengegrunnlagTab'
import { Valideringer } from '@components/valideringer/Valideringer'

const VALID_TABS = [
    'yrkesaktivitet',
    'sykepengegrunnlag',
    'nysykepengegrunnlag',
    'vilkar',
    'dagoversikt',
    'inntekter-fordeling',
    'refusjon',
    'frihand-sykepengegrunnlag',
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
            <BehandlingHeading />
            <Valideringer sluttvalidering={false} />
            <Tabs value={activeTab} onChange={handleTabChange}>
                <HStack
                    wrap={false}
                    className="w-full inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtle-a [&>*:first-child]:w-fit [&>*:first-child]:inset-shadow-none"
                >
                    <TabsList>
                        <TabsTab value="yrkesaktivitet" label="Yrkesaktivitet" />
                        <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                        <TabsTab value="vilkar" label="Vilkårsvurdering" />
                        <TabsTab value="dagoversikt" label="Dagoversikt" />
                    </TabsList>
                    <ActionMenu>
                        <ActionMenu.Trigger>
                            <HStack
                                as="button"
                                align="center"
                                justify="center"
                                wrap={false}
                                gap="2"
                                className="cursor-pointer px-4 py-3 leading-6 font-semibold text-ax-text-accent-subtle inset-shadow-ax-border-neutral-subtle-a transition-shadow duration-[200ms] ease-[cubic-bezier(.2,0,0,1)] hover:inset-shadow-[0px_-4px]"
                            >
                                <span>Meny</span>
                                <ChevronDownIcon aria-hidden fontSize={20} />
                            </HStack>
                        </ActionMenu.Trigger>
                        <ActionMenu.Content>
                            <ActionMenu.Group label="Spesialverktøy">
                                <ActionMenu.Item
                                    onSelect={() => {
                                        handleTabChange('frihand-sykepengegrunnlag')
                                    }}
                                >
                                    Opprett frihånd sykepengegrunnlag
                                </ActionMenu.Item>
                                <ActionMenu.Item
                                    onSelect={() => {
                                        handleTabChange('refusjon')
                                    }}
                                >
                                    Refusjon
                                </ActionMenu.Item>
                            </ActionMenu.Group>
                        </ActionMenu.Content>
                    </ActionMenu>
                </HStack>

                <YrkesaktivitetTab value="yrkesaktivitet" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <VilkårsvurderingTab value="vilkar" />
                <Dagoversikt value="dagoversikt" />
                <RefusjonTab value="refusjon" />
                <FrihåndSykepengegrunnlagTab value="frihand-sykepengegrunnlag" />
            </Tabs>
        </section>
    )
}

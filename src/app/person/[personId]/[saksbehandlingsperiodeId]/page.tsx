'use client'

import { ReactElement, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { VilkårsvurderingTab } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTab'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { SaksbehandlingsperiodeHeading } from '@components/saksbilde/SaksbehandlingsperiodeHeading'
import { YrkesaktivitetTab } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetTab'
import { useHash } from '@hooks/useHash'

const VALID_TABS = ['yrkesaktivitet', 'sykepengegrunnlag', 'vilkar', 'dagoversikt'] as const
const DEFAULT_TAB = 'yrkesaktivitet'

export default function PersonPage(): ReactElement {
    const router = useRouter()
    const pathname = usePathname()
    const hash = useHash()
    const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB)

    // Oppdater aktiv tab basert på hash
    useEffect(() => {
        if (hash && VALID_TABS.includes(hash as (typeof VALID_TABS)[number])) {
            setActiveTab(hash)
        } else {
            setActiveTab(DEFAULT_TAB)
        }
    }, [hash])

    const handleTabChange = (newTab: string) => {
        setActiveTab(newTab)

        // Bruk Next.js router for å oppdatere hash fragment
        router.push(`${pathname}#${newTab}`, { scroll: false })
    }

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

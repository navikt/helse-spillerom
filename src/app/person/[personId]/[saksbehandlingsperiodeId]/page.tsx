import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { VilkårsvurderingTabs } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTabs'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { YrkesaktivitetTabell } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetTabell'
import { SaksbehandlingsperiodeHeading } from '@components/saksbilde/SaksbehandlingsperiodeHeading'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <SaksbehandlingsperiodeHeading />
            <Tabs defaultValue="yrkesaktivitet">
                <TabsList>
                    <TabsTab value="yrkesaktivitet" label="Yrkesaktivitet" />
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkårsvurdering" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <YrkesaktivitetTabell value="yrkesaktivitet" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <VilkårsvurderingTabs value="vilkårsvurdering" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

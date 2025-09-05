import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { VilkårsvurderingTab } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTab'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { SaksbehandlingsperiodeHeading } from '@components/saksbilde/SaksbehandlingsperiodeHeading'
import { YrkesaktivitetTab } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetTab'

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
                <YrkesaktivitetTab value="yrkesaktivitet" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <VilkårsvurderingTab value="vilkårsvurdering" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

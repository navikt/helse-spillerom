import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { VilkårsvurderingTabs } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingTabs'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { InntektsforholdTabell } from '@components/saksbilde/inntektsforhold/InntektsforholdTabell'
import { SaksbehandlingsperiodeHeading } from '@components/saksbilde/SaksbehandlingsperiodeHeading'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <SaksbehandlingsperiodeHeading />
            <Tabs defaultValue="inntektsforhold">
                <TabsList>
                    <TabsTab value="inntektsforhold" label="Inntektsforhold" />
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkårsvurdering" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <InntektsforholdTabell value="inntektsforhold" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <VilkårsvurderingTabs value="vilkårsvurdering" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

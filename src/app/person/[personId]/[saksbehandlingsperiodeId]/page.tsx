import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { Vilkårsvurdering } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { VilkårsvurderingV2 } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingV2'
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
                    <TabsTab value="vilkårsvurdering" label="vilkår old" />
                    <TabsTab value="vilkårsvurderingv2" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <InntektsforholdTabell value="inntektsforhold" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <Vilkårsvurdering value="vilkårsvurdering" />
                <VilkårsvurderingV2 value="vilkårsvurderingv2" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { Vilkårsvurdering } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { InntektsforholdTabell } from '@components/saksbilde/inntektsforhold/InntektsforholdTabell'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <Tabs defaultValue="inntektsforhold">
                <TabsList>
                    <TabsTab value="inntektsforhold" label="InntektsforholdTabell" />
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkårsvurdering" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <InntektsforholdTabell value="inntektsforhold" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <Vilkårsvurdering value="vilkårsvurdering" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

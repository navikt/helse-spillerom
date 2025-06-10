import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { Vilkårsvurdering } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'
import { Beregningsvilkår } from '@components/saksbilde/beregningsvilkår/Beregningsvilkår'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <Tabs defaultValue="vilkårsvurdering">
                <TabsList>
                    <TabsTab value="beregningsvilkår" label="Beregningsvilkår" />
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkårsvurdering" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <Beregningsvilkår value="beregningsvilkår" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <Vilkårsvurdering value="vilkårsvurdering" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

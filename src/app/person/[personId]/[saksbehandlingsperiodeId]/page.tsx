import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { Vilkårsvurdering } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <Tabs defaultValue="inngangsvilkår">
                <TabsList>
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkårsvurdering" label="Vilkårsvurdering" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <Vilkårsvurdering value="vilkårsvurdering" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

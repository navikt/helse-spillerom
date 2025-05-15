import { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'
import { TabsList, TabsTab } from '@navikt/ds-react/Tabs'

import { Inngangsvilkår } from '@components/saksbilde/inngangsvilkår/Inngangsvilkår'
import { Sykepengegrunnlag } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { Vilkårsgrunnlag } from '@components/saksbilde/vilkårsgrunnlag/Vilkårsgrunnlag'
import { Dagoversikt } from '@components/saksbilde/dagoversikt/Dagoversikt'

export default async function PersonPage(): Promise<ReactElement> {
    return (
        <section className="flex-auto">
            <Tabs defaultValue="inngangsvilkår">
                <TabsList>
                    <TabsTab value="inngangsvilkår" label="Inngangsvilkår" />
                    <TabsTab value="sykepengegrunnlag" label="Sykepengegrunnlag" />
                    <TabsTab value="vilkårsgrunnlag" label="Vilkårsgrunnlag" />
                    <TabsTab value="dagoversikt" label="Dagoversikt" />
                </TabsList>
                <Inngangsvilkår value="inngangsvilkår" />
                <Sykepengegrunnlag value="sykepengegrunnlag" />
                <Vilkårsgrunnlag value="vilkårsgrunnlag" />
                <Dagoversikt value="dagoversikt" />
            </Tabs>
        </section>
    )
}

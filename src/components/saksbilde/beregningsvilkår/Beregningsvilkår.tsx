'use client'

import React, { ReactElement } from 'react'
import { Tabs } from '@navikt/ds-react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { useKodeverk } from '@hooks/queries/useKodeverk'
import { VilkårsvurderingAccordionContent } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'

export function Beregningsvilkår({ value }: { value: string }): ReactElement {
    const { data: vilkårsvurderinger, isLoading, isError } = useVilkaarsvurderinger()
    const { data: kodeverk, isLoading: kodeverkLoading, isError: kodeverkError } = useKodeverk()

    if (kodeverkLoading || isLoading || kodeverkError || isError || !kodeverk) return <></> // skeleton?

    return (
        <SaksbildePanel value={value}>
            <Tabs defaultValue="naring">
                <Tabs.List>
                    <Tabs.Tab value="naring" label="Selvstendig næringsdrivende" />
                    <Tabs.Tab value="rema" label="Rema 1000" />
                </Tabs.List>
                <Tabs.Panel value="naring" className="h-24 w-full bg-gray-50 p-4">
                    <VilkårsvurderingAccordionContent
                        vilkårListe={kodeverk.filter((a) => a.kategori === 'selvstendig_næringsdrivende')}
                        vilkårsvurderinger={vilkårsvurderinger}
                    />
                </Tabs.Panel>
                <Tabs.Panel value="rema" className="h-24 w-full bg-gray-50 p-4">
                    <VilkårsvurderingAccordionContent
                        vilkårListe={kodeverk.filter((a) => a.kategori === 'arbeidstakere')}
                        vilkårsvurderinger={vilkårsvurderinger}
                    />
                </Tabs.Panel>
            </Tabs>
        </SaksbildePanel>
    )
}

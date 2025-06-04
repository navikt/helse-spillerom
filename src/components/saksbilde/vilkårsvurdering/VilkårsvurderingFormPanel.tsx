import { ReactElement } from 'react'
import { Heading, HStack, VStack } from '@navikt/ds-react'

import { Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { VilkårsvurderingForm } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingForm'
import { Vilkaarsvurdering } from '@schemas/vilkaarsvurdering'
import { getVurderingIcon } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'

interface VilkårsvurderingFormPanelProps {
    vilkår?: Vilkår
    vurdering?: Vilkaarsvurdering
    neste: () => void
}

export function VilkårsvurderingFormPanel({ vilkår, vurdering, neste }: VilkårsvurderingFormPanelProps): ReactElement {
    if (!vilkår) return <></>

    return (
        <VStack className="mt-12 grow border-t-2 border-border-default bg-surface-selected p-4" gap="8">
            <HStack gap="4" wrap={false}>
                <span className="h-6 w-6">{getVurderingIcon(vurdering?.vurdering)}</span>
                <Heading level="2" size="xsmall">
                    <span className="mr-2">
                        § {vilkår.vilkårshjemmel.paragraf} {vilkår.vilkårshjemmel.ledd} {vilkår.vilkårshjemmel.bokstav}{' '}
                        {vilkår.vilkårshjemmel.setning}
                    </span>
                    {vilkår.beskrivelse}
                </Heading>
            </HStack>
            <VilkårsvurderingForm vilkår={vilkår} vurdering={vurdering} neste={neste} />
        </VStack>
    )
}

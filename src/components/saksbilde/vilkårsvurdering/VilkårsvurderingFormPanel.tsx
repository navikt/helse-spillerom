import { ReactElement } from 'react'
import { Heading, HStack, VStack } from '@navikt/ds-react'

import { Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { VilkårsvurderingForm } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingForm'
import { Vilkaarsvurdering } from '@schemas/vilkaarsvurdering'
import { getVurderingIcon } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'

interface VilkårsvurderingFormPanelProps {
    vilkår?: Vilkår
    vurdering?: Vilkaarsvurdering
    nesteAction: () => void
}

export function VilkårsvurderingFormPanel({
    vilkår,
    vurdering,
    nesteAction,
}: VilkårsvurderingFormPanelProps): ReactElement {
    if (!vilkår) return <></>

    return (
        <VStack
            className="-ml-px mt-12 grow border-l border-t-2 border-border-default bg-surface-selected px-4 py-3"
            gap="8"
        >
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
            <VilkårsvurderingForm vilkår={vilkår} vurdering={vurdering} nesteAction={nesteAction} />
        </VStack>
    )
}

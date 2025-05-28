import { ReactElement } from 'react'
import { Heading, HStack, VStack } from '@navikt/ds-react'
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'

import { Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { VilkårsvurderingForm } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingForm'

export function VilkårsvurderingFormPanel({ vilkår }: { vilkår?: Vilkår }): ReactElement {
    if (!vilkår) return <></>

    return (
        <VStack className="mt-12 grow border-t-2 border-border-default bg-surface-selected p-4" gap="8">
            <HStack gap="4" wrap={false}>
                <span className="h-6 w-6">
                    <ExclamationmarkTriangleFillIcon fontSize={24} className="text-icon-warning" />
                </span>
                <Heading level="2" size="xsmall">
                    <span className="mr-2">
                        § {vilkår.vilkårshjemmel.paragraf} {vilkår.vilkårshjemmel.ledd} {vilkår.vilkårshjemmel.bokstav}{' '}
                        {vilkår.vilkårshjemmel.setning}
                    </span>
                    {vilkår.beskrivelse}
                </Heading>
            </HStack>
            <VilkårsvurderingForm vilkår={vilkår} />
        </VStack>
    )
}

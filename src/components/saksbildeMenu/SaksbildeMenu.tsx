import React, { ReactElement } from 'react'
import { Box, BoxProps, HStack } from '@navikt/ds-react'

import { NavLenke } from './NavLenke'

export const SaksbildeMenu = ({ disabled }: { disabled: boolean }): ReactElement => {
    return (
        <SaksbildeMenuWrapper>
            <HStack>
                <HStack as="nav" role="tablist">
                    <NavLenke to="inntektsforhold" tittel="Inntektsforhold" disabled={disabled} />
                    <NavLenke to="inngangsvilkaar" tittel="Inngangsvilkår" disabled={disabled} />
                    <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" disabled={disabled} />
                    <NavLenke to="vilkarsvurdering" tittel="Vilkårsvurdering" disabled={disabled} />
                    <NavLenke to="dagoversikt" tittel="Dagoversikt" disabled={disabled} />
                </HStack>
            </HStack>
        </SaksbildeMenuWrapper>
    )
}

const SaksbildeMenuWrapper = (props: BoxProps) => (
    <Box
        paddingInline="4"
        borderWidth="0 0 1 0"
        borderColor="border-subtle"
        height="3rem"
        overflow="hidden"
        {...props}
    />
)

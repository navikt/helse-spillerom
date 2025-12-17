import { CopyButton, HStack } from '@navikt/ds-react'
import { ReactElement } from 'react'

export function OrgMedCopyButton({ orgnummer, orgnavn }: { orgnummer: string; orgnavn: string }): ReactElement {
    return (
        <HStack align="center" gap="2">
            <span data-sensitive>{orgnavn}</span>
            <HStack>
                (<span data-sensitive>{orgnummer}</span> <CopyButton copyText={orgnummer} size="xsmall" />)
            </HStack>
        </HStack>
    )
}

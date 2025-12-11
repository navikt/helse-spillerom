import { CopyButton } from '@navikt/ds-react'
import { ReactElement } from 'react'

export function OrgMedCopyButton({ orgnummer, orgnavn }: { orgnummer: string; orgnavn: string }): ReactElement {
    return (
        <span className="flex flex-row items-center">
            {orgnavn} ({orgnummer} <CopyButton copyText={orgnummer} size="xsmall" />)
        </span>
    )
}

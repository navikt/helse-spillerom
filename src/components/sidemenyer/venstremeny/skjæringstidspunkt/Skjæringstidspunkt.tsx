import { ReactElement, useState } from 'react'
import { BodyShort, Button, HStack, Tooltip } from '@navikt/ds-react'

import { getFormattedDateString } from '@utils/date-format'
import { SkjæringstidspunktForm } from '@components/sidemenyer/venstremeny/skjæringstidspunkt/SkjæringstidspunktForm'
import { SkjæringstidspunktIcon } from '@components/ikoner/SkjæringstidspunktIcon'
import { cn } from '@utils/tw'

interface SkjæringstidspunktProps {
    dato: string
    saksbehandlingsperiodeId: string
}

export function Skjæringstidspunkt({ dato, saksbehandlingsperiodeId }: SkjæringstidspunktProps): ReactElement {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <HStack gap="2" align={isEditing ? 'start' : 'center'} className="mb-4" wrap={false}>
            <Tooltip content="Skjæringstidspunkt">
                <SkjæringstidspunktIcon aria-hidden fontSize="1.25rem" className={cn({ 'mt-1.5': isEditing })} />
            </Tooltip>
            {isEditing ? (
                <SkjæringstidspunktForm
                    dato={dato}
                    saksbehandlingsperiodeId={saksbehandlingsperiodeId}
                    avbryt={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <BodyShort size="small">{getFormattedDateString(dato)}</BodyShort>
                    <Button type="button" size="xsmall" variant="tertiary" onClick={() => setIsEditing(true)}>
                        Rediger
                    </Button>
                </>
            )}
        </HStack>
    )
}

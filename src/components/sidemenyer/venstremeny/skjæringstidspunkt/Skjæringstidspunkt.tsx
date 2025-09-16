import { ReactElement, useState } from 'react'
import { CalendarIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HStack } from '@navikt/ds-react'

import { getFormattedDateString } from '@utils/date-format'
import { SkjæringstidspunktForm } from '@components/sidemenyer/venstremeny/skjæringstidspunkt/SkjæringstidspunktForm'
import { cn } from '@utils/tw'

interface SkjæringstidspunktProps {
    dato: string
    saksbehandlingsperiodeId: string
}

export function Skjæringstidspunkt({ dato, saksbehandlingsperiodeId }: SkjæringstidspunktProps): ReactElement {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <HStack gap="2" align={isEditing ? 'start' : 'center'} className="mb-4" wrap={false}>
            <CalendarIcon
                aria-hidden
                fontSize="1.25rem"
                aria-label="Skjæringstidspunkt"
                className={cn({ 'mt-1.5': isEditing })}
            />
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

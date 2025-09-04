import React, { ReactElement, useState } from 'react'
import { useController } from 'react-hook-form'
import { TextField } from '@navikt/ds-react'

import { kronerTilØrer, øreTilDisplay } from '@schemas/sykepengegrunnlag'
import { cn } from '@utils/tw'

interface PengerFieldProps {
    name: string
    label: string
    className: string
}

export function PengerField({ name, label, className }: PengerFieldProps): ReactElement {
    const { field, fieldState } = useController({ name })
    const [display, setDisplay] = useState(() => øreTilDisplay(field.value))
    const commit = () => field.onChange(kronerTilØrer(display))

    return (
        <TextField
            id={name.replaceAll('.', '-')}
            value={display}
            onMouseDown={(e) => {
                if (document.activeElement !== e.target) {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).select()
                }
            }}
            onChange={(e) => setDisplay(e.target.value)}
            onBlur={() => {
                commit()
                field.onBlur()
            }}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
            className={cn('[&_input]:text-right', className)}
            error={fieldState.error?.message != undefined}
            label={label}
            size="small"
        />
    )
}

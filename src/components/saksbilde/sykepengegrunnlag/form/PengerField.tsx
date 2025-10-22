import React, { ReactElement, useState } from 'react'
import { useController } from 'react-hook-form'
import { TextField } from '@navikt/ds-react'

import { cn } from '@utils/tw'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'

interface PengerFieldProps {
    name: string
    label: string
    className: string
}

export function PengerField({ name, label, className }: PengerFieldProps): ReactElement {
    const { field, fieldState } = useController({ name })
    const [display, setDisplay] = useState<string>(
        field.value == null ? '' : formaterBeløpKroner(field.value, 2, 'decimal'),
    )

    const parse = (val: string) => Number(val.replace(/\s/g, '').replace(',', '.'))

    const commit = () => {
        const parsed = parse(display)
        field.onChange(isNaN(parsed) ? null : parsed)
    }

    return (
        <TextField
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
                if (display !== '') {
                    setDisplay(formaterBeløpKroner(parse(display), 2, 'decimal'))
                }
                field.onBlur()
            }}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
            className={cn('[&_input]:text-right', className)}
            error={fieldState.error?.message}
            label={label}
            size="small"
        />
    )
}

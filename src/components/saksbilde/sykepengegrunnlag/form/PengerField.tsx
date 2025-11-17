import React, { ReactElement, useEffect, useState } from 'react'
import { useController } from 'react-hook-form'
import { TextField } from '@navikt/ds-react'

import { cn } from '@utils/tw'
import { formaterBeløpKroner } from '@schemas/øreUtils'

interface PengerFieldProps {
    name: string
    label: string
    readOnly?: boolean
    className: string
}

export function PengerField({ name, label, readOnly = false, className }: PengerFieldProps): ReactElement {
    const { field, fieldState } = useController({ name })
    const [display, setDisplay] = useState<string>(
        field.value == null ? '' : formaterBeløpKroner(field.value, 2, 'decimal'),
    )

    useEffect(() => {
        setDisplay(field.value == null ? '' : formaterBeløpKroner(field.value, 2, 'decimal'))
    }, [field.value])

    const parse = (val: string) => Number(val.replace(/\s/g, '').replace(',', '.'))

    const commit = () => {
        const parsed = parse(display)
        field.onChange(display.trim() === '' || isNaN(parsed) ? undefined : parsed)
    }

    return (
        <TextField
            readOnly={readOnly}
            value={display}
            id={name.replaceAll('.', '-')}
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
            error={fieldState.error?.message != undefined}
            label={label}
            size="small"
        />
    )
}

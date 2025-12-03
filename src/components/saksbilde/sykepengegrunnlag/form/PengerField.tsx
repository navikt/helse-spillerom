import React, { ReactElement, useState } from 'react'
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
    const [editingValue, setEditingValue] = useState<string | null>(null)

    const parse = (val: string) => Number(val.replace(/\s/g, '').replace(',', '.'))

    const commit = (value: string) => {
        const parsed = parse(value)
        field.onChange(value.trim() === '' || isNaN(parsed) ? undefined : parsed)
        setEditingValue(null)
    }

    const displayValue = editingValue ?? (field.value == null ? '' : formaterBeløpKroner(field.value, 2, 'decimal'))

    return (
        <TextField
            readOnly={readOnly}
            value={displayValue}
            id={name.replaceAll('.', '-')}
            onMouseDown={(e) => {
                if (document.activeElement !== e.target) {
                    e.preventDefault()
                    ;(e.target as HTMLInputElement).select()
                }
            }}
            onFocus={(e) => {
                setEditingValue(e.target.value)
            }}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={(e) => {
                const value = e.target.value
                commit(value)
                field.onBlur()
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    commit((e.target as HTMLInputElement).value)
                }
            }}
            className={cn('[&_input]:text-right', className)}
            error={fieldState.error?.message != undefined}
            label={label}
            size="small"
        />
    )
}

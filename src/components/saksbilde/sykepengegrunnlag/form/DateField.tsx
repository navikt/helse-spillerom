import React, { ReactElement } from 'react'
import { useController } from 'react-hook-form'
import { DatePicker, useDatepicker } from '@navikt/ds-react'

import { gyldigDatoFormat } from '@utils/date-format'

interface DateFieldProps {
    name: string
    label: string
}

export function DateField({ name, label }: DateFieldProps): ReactElement {
    const { field, fieldState } = useController({ name })

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value,
        onDateChange: (date) => {
            if (!date) {
                field.onChange(null)
            } else {
                field.onChange(gyldigDatoFormat(date))
            }
        },
    })

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                id={name.replaceAll('.', '-')}
                size="small"
                label={label}
                onBlur={field.onBlur}
                error={fieldState.error?.message != undefined}
            />
        </DatePicker>
    )
}

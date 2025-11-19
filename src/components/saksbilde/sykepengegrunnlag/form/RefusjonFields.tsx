import React, { ReactElement } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button, HStack, VStack } from '@navikt/ds-react'

import { DateField } from '@components/saksbilde/sykepengegrunnlag/form/DateField'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { cn } from '@utils/tw'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'

export function RefusjonFields(): ReactElement {
    const { control } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const refusjonFieldArray = useFieldArray<InntektRequestFor<'ARBEIDSTAKER'>>({
        control,
        name: 'data.refusjon',
    })

    return (
        <VStack gap="4">
            {refusjonFieldArray.fields.map((field, index) => (
                <HStack key={field.id} gap="2" align="start" wrap={false}>
                    <DateField name={`data.refusjon.${index}.fom`} label="F.o.m. dato" />
                    <DateField name={`data.refusjon.${index}.tom`} label="T.o.m. dato" />
                    <PengerField className="max-w-28" name={`data.refusjon.${index}.beløp`} label="Refusjonsbeløp" />
                    <Button
                        className={cn('mb-1 self-end', { invisible: index === 0 })}
                        size="xsmall"
                        variant="tertiary"
                        type="button"
                        onClick={() => refusjonFieldArray.remove(index)}
                    >
                        Slett
                    </Button>
                </HStack>
            ))}
            <Button
                size="xsmall"
                variant="tertiary"
                type="button"
                onClick={() => refusjonFieldArray.append({ fom: '', tom: null, beløp: 0 })}
                className="self-start"
            >
                + Legg til
            </Button>
        </VStack>
    )
}

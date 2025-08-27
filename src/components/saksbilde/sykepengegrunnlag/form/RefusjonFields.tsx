import React, { ReactElement } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button, HStack, VStack } from '@navikt/ds-react'

import { DateField } from '@components/saksbilde/sykepengegrunnlag/form/DateField'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { cn } from '@utils/tw'

export function RefusjonFields({ forholdIndex }: { forholdIndex: number }): ReactElement {
    const { control } = useFormContext()
    const refusjonFieldArray = useFieldArray({
        control,
        name: `inntekter.${forholdIndex}.refusjon`,
    })

    return (
        <VStack gap="4" className="self-end">
            {refusjonFieldArray.fields.map((field, index) => (
                <HStack key={field.id} gap="2" align="center" wrap={false}>
                    <DateField name={`inntekter.${forholdIndex}.refusjon.${index}.fom`} label="F.o.m. dato" />
                    <DateField name={`inntekter.${forholdIndex}.refusjon.${index}.tom`} label="T.o.m. dato" />
                    <PengerField
                        className="max-w-28"
                        name={`inntekter.${forholdIndex}.refusjon.${index}.beløpØre`}
                        label="Refusjonsbeløp"
                    />
                    <Button
                        className={cn('mt-7 mr-5', { invisible: index === 0 })}
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
                onClick={() => refusjonFieldArray.append({ fom: '', tom: '', beløpØre: 0 })}
                className="self-start"
            >
                + Legg til
            </Button>
        </VStack>
    )
}

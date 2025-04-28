'use client'

import React, { ReactElement } from 'react'
import { Search } from '@navikt/ds-react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { usePersonsøk } from '@hooks/mutations/usePersonsøk'
import { PersonsøkSchema, personsøkSchema } from '@/schemas/personsøk'

export function Personsøk(): ReactElement {
    const router = useRouter()
    const mutation = usePersonsøk()
    const form = useForm<PersonsøkSchema>({
        resolver: zodResolver(personsøkSchema),
        defaultValues: {
            fødselsnummer: '',
        },
    })

    async function onSubmit(values: PersonsøkSchema) {
        mutation.mutate({
            request: { fødselsnummer: values.fødselsnummer },
            callback: (personId) => router.push(`/person/${personId.personId}`),
        })
    }

    return (
        <FormProvider {...form}>
            <form role="search" onSubmit={form.handleSubmit(onSubmit)} className="w-80">
                <Controller
                    control={form.control}
                    name="fødselsnummer"
                    render={({ field, fieldState }) => (
                        <Search
                            {...field}
                            error={fieldState.error?.message}
                            label="Fødselsnummer/Aktør-ID"
                            size="medium"
                            variant="primary"
                            placeholder="Søk"
                            hideLabel={false}
                        />
                    )}
                />
            </form>
        </FormProvider>
    )
}

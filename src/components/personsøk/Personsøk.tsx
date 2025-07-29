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
            ident: '',
        },
    })

    async function onSubmit(values: PersonsøkSchema) {
        mutation.mutate({
            request: { ident: values.ident },
            callback: (personId) => router.push(`/person/${personId.personId}`),
        })
    }

    function error() {
        if (mutation.isError) {
            return mutation.error.problem?.title || 'Det oppstod en feil'
        }
        return undefined
    }

    return (
        <FormProvider {...form}>
            <form
                data-color="neutral"
                role="search"
                onSubmit={form.handleSubmit(onSubmit)}
                className="self-center px-5"
            >
                <Controller
                    control={form.control}
                    name="ident"
                    render={({ field, fieldState }) => (
                        <Search
                            {...field}
                            error={fieldState.error?.message || error()}
                            label="Fødselsnummer/Aktør-ID"
                            size="small"
                            variant="secondary"
                            placeholder="Søk"
                            hideLabel
                        />
                    )}
                />
            </form>
        </FormProvider>
    )
}

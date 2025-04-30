'use client'

import React, { ReactElement } from 'react'
import { Search, SearchProps } from '@navikt/ds-react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { usePersonsøk } from '@hooks/mutations/usePersonsøk'
import { PersonsøkSchema, personsøkSchema } from '@/schemas/personsøk'

interface PersonsøkProps {
    hideLabel?: boolean
    size?: SearchProps['size']
    variant?: SearchProps['variant']
}

export function Personsøk({ hideLabel = false, size = 'medium', variant = 'primary' }: PersonsøkProps): ReactElement {
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

    return (
        <FormProvider {...form}>
            <form role="search" onSubmit={form.handleSubmit(onSubmit)} className="self-center px-5">
                <Controller
                    control={form.control}
                    name="ident"
                    render={({ field, fieldState }) => (
                        <Search
                            {...field}
                            error={fieldState.error?.message}
                            label="Fødselsnummer/Aktør-ID"
                            size={size}
                            variant={variant}
                            placeholder="Søk"
                            hideLabel={hideLabel}
                        />
                    )}
                />
            </form>
        </FormProvider>
    )
}

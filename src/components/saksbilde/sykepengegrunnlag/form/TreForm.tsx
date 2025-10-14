import { ReactElement } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function TreForm(): ReactElement {
    const form = useForm({
        resolver: zodResolver(),
        defaultValues: {},
    })

    async function onSubmit(values: string) {
        console.log(values)
        // await mutation.mutateAsync(values).then(() => {
        //     form.reset()
        //     abryt()
        // })
    }

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)}>
                TreForm
            </form>
        </FormProvider>
    )
}

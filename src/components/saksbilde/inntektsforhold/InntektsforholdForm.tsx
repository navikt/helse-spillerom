import { ReactElement } from 'react'

export function InntektsforholdForm({ closeForm }: { closeForm: () => void }): ReactElement {
    return <></>
    // const mutation = useOpprettInntektsforhold()
    // const form = useForm<InntektsforholdSchema>({
    //     resolver: zodResolver(inntektsforholdSchema),
    //     defaultValues: {
    //         id: '',
    //         svar: {
    //             INNTEKTSKATEGORI: 'ARBEIDSTAKER',
    //             TYPE_ARBEIDSTAKER: 'ORDINÆRT_ARBEIDSFORHOLD',
    //         },
    //         sykmeldtFraForholdet: false,
    //         orgnummer: '',
    //         orgnavn: '',
    //     },
    // })
    //
    // async function onSubmit(values: InntektsforholdSchema) {
    //     await mutation.mutateAsync(
    //         {
    //             svar: values.svar,
    //             sykmeldtFraForholdet: values.sykmeldtFraForholdet,
    //             orgnummer: values.orgnummer,
    //         },
    //         {
    //             onSuccess: () => {
    //                 closeForm()
    //             },
    //         },
    //     )
    // }
    //
    // const svar = form.watch('svar')
    // const inntektskategori = svar?.INNTEKTSKATEGORI
    // const typeArbeidstaker = svar?.TYPE_ARBEIDSTAKER
    //
    // return (
    //     <FormProvider {...form}>
    //         <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
    //             <Heading size="small">Opprett nytt inntektsforhold</Heading>
    //             <Controller
    //                 control={form.control}
    //                 name="svar.INNTEKTSKATEGORI"
    //                 render={({ field, fieldState }) => (
    //                     <Select
    //                         {...field}
    //                         className="max-w-96"
    //                         label="Inntektskategori"
    //                         error={fieldState.error?.message}
    //                     >
    //                         <option value="ARBEIDSTAKER">Arbeidstaker</option>
    //                         <option value="FRILANSER">Frilanser</option>
    //                         <option value="SELVSTENDIG_NÆRINGSDRIVENDE">Selvstendig næringsdrivende</option>
    //                         <option value="INAKTIV">Inaktiv</option>
    //                     </Select>
    //                 )}
    //             />
    //             {inntektskategori === 'ARBEIDSTAKER' && typeArbeidstaker === 'ORDINÆRT_ARBEIDSFORHOLD' && (
    //                 <Controller
    //                     control={form.control}
    //                     name="orgnummer"
    //                     render={({ field, fieldState }) => (
    //                         <TextField
    //                             {...field}
    //                             className="max-w-96"
    //                             label="Organisasjonsnummer"
    //                             placeholder="123456789"
    //                             description="9-sifret organisasjonsnummer"
    //                             error={fieldState.error?.message}
    //                         />
    //                     )}
    //                 />
    //             )}
    //             <Controller
    //                 control={form.control}
    //                 name="sykmeldtFraForholdet"
    //                 render={({ field }) => (
    //                     <Switch checked={field.value} onChange={field.onChange}>
    //                         Sykmeldt fra forholdet
    //                     </Switch>
    //                 )}
    //             />
    //             <HStack gap="4">
    //                 <Button variant="primary" size="small" type="submit" loading={form.formState.isSubmitting}>
    //                     Opprett
    //                 </Button>
    //                 <Button
    //                     variant="tertiary"
    //                     size="small"
    //                     type="button"
    //                     disabled={form.formState.isSubmitting}
    //                     onClick={() => closeForm()}
    //                 >
    //                     Avbryt
    //                 </Button>
    //             </HStack>
    //         </form>
    //     </FormProvider>
    // )
}

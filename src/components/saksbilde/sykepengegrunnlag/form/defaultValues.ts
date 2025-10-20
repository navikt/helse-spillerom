import {
    ArbeidsledigInntektRequest,
    ArbeidsledigInntektType,
    ArbeidstakerInntektRequest,
    ArbeidstakerInntektType,
    arbeidstakerSkjønnsfastsettelseÅrsakSchema,
    FrilanserInntektRequest,
    FrilanserInntektType,
    frilanserSkjønnsfastsettelseÅrsakSchema,
    InntektRequest,
    Inntektskategori,
    PensjonsgivendeInntektRequest,
    PensjonsgivendeInntektType,
    pensjonsgivendeSkjønnsfastsettelseÅrsakSchema,
} from '@schemas/inntektRequest'

export type InntektRequestFor<K extends Inntektskategori> = Extract<InntektRequest, { inntektskategori: K }>

export function getDefaultValues<K extends Inntektskategori>(
    kategori: K,
    persisted?: Partial<InntektRequestFor<K>>,
): InntektRequestFor<K> {
    const base: InntektRequestFor<K> = {
        inntektskategori: kategori,
        data: defaultValuesMap[kategori],
    } as InntektRequestFor<K>

    // Merge persisted
    return { ...base, ...persisted } as InntektRequestFor<K>
}

// Arbeidstaker
const arbeidstakerDefaults: Record<
    ArbeidstakerInntektType,
    Extract<ArbeidstakerInntektRequest, { type: ArbeidstakerInntektType }>
> = {
    INNTEKTSMELDING: { type: 'INNTEKTSMELDING', inntektsmeldingId: '', begrunnelse: '', refusjon: undefined },
    AINNTEKT: { type: 'AINNTEKT', begrunnelse: '', refusjon: undefined },
    SKJONNSFASTSETTELSE: {
        type: 'SKJONNSFASTSETTELSE',
        årsinntekt: 0,
        årsak: arbeidstakerSkjønnsfastsettelseÅrsakSchema.options[0],
        begrunnelse: '',
        refusjon: undefined,
    },
    MANUELT_BEREGNET: { type: 'MANUELT_BEREGNET', årsinntekt: 0, begrunnelse: '', refusjon: undefined },
}

// SELVSTENDIG / INAKTIV
const pensjonsgivendeDefaults: Record<
    PensjonsgivendeInntektType,
    Extract<PensjonsgivendeInntektRequest, { type: PensjonsgivendeInntektType }>
> = {
    PENSJONSGIVENDE_INNTEKT: { type: 'PENSJONSGIVENDE_INNTEKT', begrunnelse: '' },
    SKJONNSFASTSETTELSE: {
        type: 'SKJONNSFASTSETTELSE',
        årsinntekt: 0,
        årsak: pensjonsgivendeSkjønnsfastsettelseÅrsakSchema.options[0],
        begrunnelse: '',
    },
}

// FRILANSER
const frilanserDefaults: Record<
    FrilanserInntektType,
    Extract<FrilanserInntektRequest, { type: FrilanserInntektType }>
> = {
    AINNTEKT: { type: 'AINNTEKT', begrunnelse: '' },
    SKJONNSFASTSETTELSE: {
        type: 'SKJONNSFASTSETTELSE',
        årsinntekt: 0,
        årsak: frilanserSkjønnsfastsettelseÅrsakSchema.options[0],
        begrunnelse: '',
    },
}

// ARBEIDSLEDIG
const arbeidsledigDefaults: Record<
    ArbeidsledigInntektType,
    Extract<ArbeidsledigInntektRequest, { type: ArbeidsledigInntektType }>
> = {
    DAGPENGER: { type: 'DAGPENGER', dagbeløp: 0, begrunnelse: '' },
    VENTELONN: { type: 'VENTELONN', årsinntekt: 0, begrunnelse: '' },
    VARTPENGER: { type: 'VARTPENGER', årsinntekt: 0, begrunnelse: '' },
}

const defaultValuesMap: {
    ARBEIDSTAKER: ArbeidstakerInntektRequest
    SELVSTENDIG_NÆRINGSDRIVENDE: PensjonsgivendeInntektRequest
    INAKTIV: PensjonsgivendeInntektRequest
    FRILANSER: FrilanserInntektRequest
    ARBEIDSLEDIG: ArbeidsledigInntektRequest
} = {
    ARBEIDSTAKER: arbeidstakerDefaults['MANUELT_BEREGNET'],
    SELVSTENDIG_NÆRINGSDRIVENDE: pensjonsgivendeDefaults['PENSJONSGIVENDE_INNTEKT'],
    INAKTIV: pensjonsgivendeDefaults['PENSJONSGIVENDE_INNTEKT'],
    FRILANSER: frilanserDefaults['AINNTEKT'],
    ARBEIDSLEDIG: arbeidsledigDefaults['DAGPENGER'],
}

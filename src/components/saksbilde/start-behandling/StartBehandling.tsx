'use client'

import { ReactElement, useState } from 'react'
import {
    Alert,
    Button,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Label,
    Modal,
    Switch,
    useDatepicker,
} from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSoknader } from '@hooks/queries/useSoknader'
import { useSoknad } from '@hooks/queries/useSoknad'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'
import { formaterArbeidssituasjon } from '@utils/arbeidssituasjon'
import { useOpprettSaksbehandlingsperiode } from '@hooks/mutations/useOpprettSaksbehandlingsperiode'
import { Søknadsinnhold } from '@components/søknad/Søknadsinnhold'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

interface StartBehandlingProps {
    value: string
}

const startBehandlingSchema = z
    .object({
        isManualMode: z.boolean(),
        validFromDate: z.date(),
        selectedSøknader: z.array(z.string()),
        manualFom: z.date().optional(),
        manualTom: z.date().optional(),
    })
    .refine(
        (data) => {
            if (!data.isManualMode) {
                return data.selectedSøknader.length > 0
            }
            return true
        },
        {
            path: ['selectedSøknader'],
            error: 'Du må velge minst én søknad',
        },
    )
    .refine(
        (data) => {
            if (data.isManualMode) {
                return data.manualFom && data.manualTom
            }
            return true
        },
        {
            path: ['manualFom'],
            error: 'Du må velge både fra og til dato',
        },
    )

type StartBehandlingFormData = z.infer<typeof startBehandlingSchema>

export function StartBehandling({ value }: StartBehandlingProps): ReactElement {
    const router = useRouter()
    const params = useParams()

    const [openSoknadModal, setOpenSoknadModal] = useState(false)
    const [activeSoknadId, setActiveSoknadId] = useState<string | undefined>(undefined)
    const { data: aktivSøknad, isLoading: lasterSoknad } = useSoknad(activeSoknadId)

    const { mutate: opprettSaksbehandlingsperiode, isPending, error } = useOpprettSaksbehandlingsperiode()

    // Funksjon for å få feilmelding fra error
    const getErrorMessage = (error: unknown): string => {
        if (error instanceof ProblemDetailsError) {
            return error.problem.title || 'En feil oppstod ved opprettelse av saksbehandlingsperiode'
        }
        return 'En uventet feil oppstod ved opprettelse av saksbehandlingsperiode'
    }

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<StartBehandlingFormData>({
        resolver: zodResolver(startBehandlingSchema),
        defaultValues: {
            isManualMode: false,
            validFromDate: dayjs().subtract(3, 'month').startOf('month').toDate(),
            selectedSøknader: [],
            manualFom: undefined,
            manualTom: undefined,
        },
    })

    const isManualMode = watch('isManualMode')
    const validFromDate = watch('validFromDate')
    const selectedSøknader = watch('selectedSøknader')

    const { data: søknader, isError } = useSoknader(dayjs(validFromDate))

    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange: (d) => {
            const parsedDate = dayjs(d)
            if (parsedDate.isValid()) {
                setValue('validFromDate', parsedDate.toDate())
            }
        },
        defaultSelected: validFromDate,
    })

    const { datepickerProps: fomDatepickerProps, inputProps: fomInputProps } = useDatepicker({
        onDateChange: (d) => setValue('manualFom', d),
        defaultSelected: watch('manualFom'),
    })

    const { datepickerProps: tomDatepickerProps, inputProps: tomInputProps } = useDatepicker({
        onDateChange: (d) => setValue('manualTom', d),
        defaultSelected: watch('manualTom'),
    })

    if (isError) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader?.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || formaterArbeidssituasjon(soknad.arbeidssituasjon) || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})

    const onSubmit = (data: StartBehandlingFormData) => {
        let fom: string
        let tom: string

        if (data.isManualMode) {
            if (!data.manualFom || !data.manualTom) return // TypeScript guard
            fom = dayjs(data.manualFom).format('YYYY-MM-DD')
            tom = dayjs(data.manualTom).format('YYYY-MM-DD')
        } else {
            const valgteSøknader = søknader?.filter((s) => data.selectedSøknader.includes(s.id)) || []
            if (valgteSøknader.length === 0) return

            const minFom = valgteSøknader.reduce((min, søknad) => {
                if (!søknad.fom) return min
                return !min || dayjs(søknad.fom).isBefore(dayjs(min)) ? søknad.fom : min
            }, '')

            const maxTom = valgteSøknader.reduce((max, søknad) => {
                if (!søknad.tom) return max
                return !max || dayjs(søknad.tom).isAfter(dayjs(max)) ? søknad.tom : max
            }, '')

            if (!minFom || !maxTom) return
            fom = minFom
            tom = maxTom
        }

        opprettSaksbehandlingsperiode(
            {
                request: {
                    fom,
                    tom,
                    søknader: data.isManualMode ? [] : data.selectedSøknader,
                },
                callback: () => {
                    // Callback er påkrevd men vi håndterer navigering i onSuccess
                },
            },
            {
                onSuccess: (periode) => {
                    router.push(`/person/${params.personId}/${periode.id}`)
                },
            },
        )
    }

    const handleManualModeChange = (checked: boolean) => {
        setValue('isManualMode', checked)
        if (checked) {
            setValue('selectedSøknader', [])
        } else {
            setValue('manualFom', undefined)
            setValue('manualTom', undefined)
        }
    }

    const handleSøknadSelection = (søknadId: string, checked: boolean) => {
        const currentSelected = selectedSøknader || []
        if (checked) {
            setValue('selectedSøknader', [...currentSelected, søknadId])
        } else {
            setValue(
                'selectedSøknader',
                currentSelected.filter((id) => id !== søknadId),
            )
        }
    }

    return (
        <SaksbildePanel value={value}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Vis feilmelding hvis det oppstod en feil */}
                {error && (
                    <Alert variant="error" className="mb-6">
                        {getErrorMessage(error)}
                    </Alert>
                )}

                <div className="mb-8">
                    <Controller
                        name="isManualMode"
                        control={control}
                        render={() => (
                            <Switch checked={isManualMode} onChange={(e) => handleManualModeChange(e.target.checked)}>
                                Manuell periode
                            </Switch>
                        )}
                    />
                </div>

                {!isManualMode && (
                    <>
                        <div className="mb-8">
                            <Controller
                                name="validFromDate"
                                control={control}
                                render={() => (
                                    <DatePicker {...datepickerProps}>
                                        <DatePicker.Input {...inputProps} label="Hent alle søknader etter" />
                                    </DatePicker>
                                )}
                            />
                        </div>

                        <Label spacing>Velg hvilken søknad som skal behandles</Label>
                        {søknader?.length === 0 && <div>Ingen søknader etter valgt dato</div>}
                        {søknaderGruppert &&
                            Object.entries(søknaderGruppert).map(([key, gruppe]) => (
                                <div key={key} className="mt-4">
                                    <CheckboxGroup legend={key}>
                                        {gruppe.map((søknad, j) => (
                                            <div
                                                key={j}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <Checkbox
                                                    value={søknad.id}
                                                    checked={selectedSøknader?.includes(søknad.id) || false}
                                                    onChange={(e) => handleSøknadSelection(søknad.id, e.target.checked)}
                                                >
                                                    {getFormattedDateString(søknad.fom) +
                                                        ' - ' +
                                                        getFormattedDateString(søknad.tom)}
                                                </Checkbox>
                                                <Button
                                                    variant="tertiary"
                                                    size="small"
                                                    type="button"
                                                    icon={<ExternalLinkIcon aria-hidden />}
                                                    onClick={() => {
                                                        setActiveSoknadId(søknad.id)
                                                        setOpenSoknadModal(true)
                                                    }}
                                                >
                                                    Se søknad
                                                </Button>
                                            </div>
                                        ))}
                                    </CheckboxGroup>
                                </div>
                            ))}
                        {errors.selectedSøknader?.message && (
                            <div className="text-red-600 mt-2 text-sm">{errors.selectedSøknader.message}</div>
                        )}
                    </>
                )}

                {isManualMode && (
                    <div className="space-y-4">
                        <Label spacing>Velg periode</Label>
                        <div className="flex gap-4">
                            <Controller
                                name="manualFom"
                                control={control}
                                render={() => (
                                    <DatePicker {...fomDatepickerProps}>
                                        <DatePicker.Input
                                            {...fomInputProps}
                                            label="Fra og med"
                                            error={errors.manualFom?.message}
                                        />
                                    </DatePicker>
                                )}
                            />
                            <Controller
                                name="manualTom"
                                control={control}
                                render={() => (
                                    <DatePicker {...tomDatepickerProps}>
                                        <DatePicker.Input
                                            {...tomInputProps}
                                            label="Til og med"
                                            error={errors.manualTom?.message}
                                        />
                                    </DatePicker>
                                )}
                            />
                        </div>
                    </div>
                )}

                <Button className="mt-8" size="small" type="submit" loading={isPending}>
                    Start behandling
                </Button>

                <Modal open={openSoknadModal} onClose={() => setOpenSoknadModal(false)} header={{ heading: 'Søknad' }}>
                    <Modal.Body>
                        {lasterSoknad ? (
                            <div role="status" aria-live="polite">
                                Laster søknad...
                            </div>
                        ) : aktivSøknad ? (
                            <Søknadsinnhold søknad={aktivSøknad} />
                        ) : (
                            <div>Fant ikke søknad</div>
                        )}
                    </Modal.Body>
                </Modal>
            </form>
        </SaksbildePanel>
    )
}

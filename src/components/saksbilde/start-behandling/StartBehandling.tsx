'use client'

import { ReactElement, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, DatePicker, Label, Switch, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'
import { useOpprettSaksbehandlingsperiode } from '@hooks/mutations/useOpprettSaksbehandlingsperiode'

interface StartBehandlingProps {
    value: string
}

export function StartBehandling({ value }: StartBehandlingProps): ReactElement {
    const router = useRouter()
    const params = useParams()

    const [validFromDate, setValidFromDate] = useState(dayjs().subtract(3, 'month').startOf('month'))
    const [selectedSøknader, setSelectedSøknader] = useState<string[]>([])
    const [isManualMode, setIsManualMode] = useState(false)
    const [manualFom, setManualFom] = useState<Date | undefined>(undefined)
    const [manualTom, setManualTom] = useState<Date | undefined>(undefined)
    const { data: søknader, isError } = useSoknader(validFromDate)
    const { mutate: opprettSaksbehandlingsperiode, isPending } = useOpprettSaksbehandlingsperiode()

    const [errorTekst, setErrorTekst] = useState<string | undefined>(undefined)

    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange: (d) => {
            const parsedDate = dayjs(d)
            if (parsedDate.isValid()) {
                setValidFromDate(parsedDate)
            }
        },
        defaultSelected: validFromDate.toDate(),
    })

    const { datepickerProps: fomDatepickerProps, inputProps: fomInputProps } = useDatepicker({
        onDateChange: (d) => setManualFom(d),
        defaultSelected: manualFom,
    })

    const { datepickerProps: tomDatepickerProps, inputProps: tomInputProps } = useDatepicker({
        onDateChange: (d) => setManualTom(d),
        defaultSelected: manualTom,
    })

    if (isError) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader?.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || soknad.arbeidssituasjon || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})

    const handleSubmit = () => {
        setErrorTekst(undefined)

        if (!isManualMode && selectedSøknader.length === 0) {
            setErrorTekst('Du må velge minst én søknad')
            return
        }

        if (isManualMode && (!manualFom || !manualTom)) {
            setErrorTekst('Du må velge både fra og til dato')
            return
        }

        let fom: string
        let tom: string

        if (isManualMode) {
            if (!manualFom || !manualTom) return // TypeScript guard
            fom = dayjs(manualFom).format('YYYY-MM-DD')
            tom = dayjs(manualTom).format('YYYY-MM-DD')
        } else {
            const valgteSøknader = søknader?.filter((s) => selectedSøknader.includes(s.id)) || []
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
                    søknader: isManualMode ? [] : selectedSøknader,
                },
                callback: (periode) => {
                    router.push(`/person/${params.personId}/${periode.id}`)
                },
            },
            {
                onSuccess: () => {
                    // Navigasjon skjer i callback
                },
                onError: (error) => {
                    setErrorTekst(error.message)
                },
            },
        )
    }

    return (
        <SaksbildePanel value={value}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <div className="mb-8">
                    <Switch
                        checked={isManualMode}
                        onChange={(e) => {
                            setIsManualMode(e.target.checked)
                            setErrorTekst(undefined)
                            if (e.target.checked) {
                                setSelectedSøknader([])
                            } else {
                                setManualFom(undefined)
                                setManualTom(undefined)
                            }
                        }}
                    >
                        Manuell periode
                    </Switch>
                </div>

                {!isManualMode && (
                    <>
                        <div className="mb-8">
                            <DatePicker {...datepickerProps}>
                                <DatePicker.Input {...inputProps} label="Hent alle søknader etter" />
                            </DatePicker>
                        </div>

                        <Label spacing>Velg hvilken søknad som skal behandles</Label>
                        {søknader?.length === 0 && <div>Ingen søknader etter valgt dato</div>}
                        {søknaderGruppert &&
                            Object.entries(søknaderGruppert).map(([key, gruppe]) => (
                                <div key={key} className="mt-4">
                                    <CheckboxGroup legend={key} error={errorTekst}>
                                        {gruppe.map((søknad, j) => (
                                            <div
                                                key={j}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <Checkbox
                                                    value={søknad.id}
                                                    checked={selectedSøknader.includes(søknad.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSøknader([...selectedSøknader, søknad.id])
                                                        } else {
                                                            setSelectedSøknader(
                                                                selectedSøknader.filter((id) => id !== søknad.id),
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {getFormattedDateString(søknad.fom) +
                                                        ' - ' +
                                                        getFormattedDateString(søknad.tom)}
                                                </Checkbox>
                                                <Button
                                                    as="a"
                                                    href="#" // TODO: Bytt til faktisk søknadslenke
                                                    variant="tertiary"
                                                    size="small"
                                                >
                                                    Se søknad
                                                </Button>
                                            </div>
                                        ))}
                                    </CheckboxGroup>
                                </div>
                            ))}
                    </>
                )}

                {isManualMode && (
                    <div className="space-y-4">
                        <Label spacing>Velg periode</Label>
                        <div className="flex gap-4">
                            <DatePicker {...fomDatepickerProps}>
                                <DatePicker.Input {...fomInputProps} label="Fra og med" error={errorTekst} />
                            </DatePicker>
                            <DatePicker {...tomDatepickerProps}>
                                <DatePicker.Input {...tomInputProps} label="Til og med" error={errorTekst} />
                            </DatePicker>
                        </div>
                    </div>
                )}

                <Button className="mt-8 block" size="small" type="submit" loading={isPending}>
                    Start behandling
                </Button>
            </form>
        </SaksbildePanel>
    )
}

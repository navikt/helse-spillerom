'use client'

import { ReactElement, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, DatePicker, Label, Select, useDatepicker } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'

interface StartBehandlingProps {
    value: string
}

export function StartBehandling({ value }: StartBehandlingProps): ReactElement {
    const router = useRouter()
    const params = useParams()

    const [validFromDate, setValidFromDate] = useState(dayjs().subtract(3, 'month').startOf('month'))
    const { data: søknader, isError } = useSoknader(validFromDate)
    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange: (d) => {
            const parsedDate = dayjs(d)
            if (parsedDate.isValid()) {
                setValidFromDate(parsedDate)
            }
        },
        defaultSelected: validFromDate.toDate(),
    })
    if (isError) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader?.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || soknad.arbeidssituasjon || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})
    //TODO form

    return (
        <SaksbildePanel value={value}>
            <div className="mb-8">
                <DatePicker {...datepickerProps}>
                    <DatePicker.Input {...inputProps} label="Hent alle søknader etter" />
                </DatePicker>
            </div>
            <Label spacing>Velg hvilken søknad som skal behandles</Label>
            {søknaderGruppert &&
                Object.entries(søknaderGruppert).map(([key, gruppe]) => (
                    <div key={key} className="mt-4">
                        <CheckboxGroup legend={key}>
                            {gruppe.map((søknad, j) => (
                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Checkbox value={søknad.id}>
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
            <Button variant="tertiary" size="small" className="mt-2 mb-6" type="button">
                Legg inn søknadsperiode manuelt
            </Button>
            <Select label="Hvilken inntektskategori tilhører søkeren?" className="my-8">
                {arbeidssituasjoner.map((situasjon) => (
                    <option key={situasjon} value={situasjon}>
                        {situasjon}
                    </option>
                ))}
            </Select>
            <Button
                size="small"
                onClick={() => {
                    router.push('/person/' + params.personId + '/1234567')
                }}
            >
                Start behandling
            </Button>
        </SaksbildePanel>
    )
}

const arbeidssituasjoner = [
    'ARBEIDSTAKER',
    'SELVSTENDIG NÆRINGSDRIVENDE',
    'SJØMANN',
    'JORDBRUKER',
    'ARBEIDSLEDIG',
    'INAKTIV',
    'MILITÆR (BEFAL)',
    'VERNEPLIKTIG',
    'ARBEIDSTAKER M/SJØMANN',
    'INAKTIVT M/SJØMANN',
    'SVALBARDARBEIDER',
    'AMBASSADEPERSONELL',
    'UTØVER AV REINDRIFT',
    'FISKE/ARBEIDSTAKER',
    'FRILANSER M/FORSIKRING FOR TILLEGGSSYKEPENGER',
    'FFU',
    'ARBEIDSTAKER / A-LØYSE',
    'FRILANSER UTEN FORSIKRING',
    'SELVSTENDIG DAGMAMMA/DAGPAPPA',
    'FISKER M/HYRE',
]

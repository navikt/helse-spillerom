'use client'

import { ReactElement } from 'react'
import { Button, Checkbox, CheckboxGroup, Label, Select } from '@navikt/ds-react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useSoknader } from '@hooks/queries/useSoknader'
import { Søknad } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'

interface StartBehandlingProps {
    value: string
}

export function StartBehandling({ value }: StartBehandlingProps): ReactElement {
    const { data: søknader, isLoading, isError } = useSoknader()

    if (isLoading) return <></>
    if (isError || !søknader) return <></> // vis noe fornuftig

    const søknaderGruppert = søknader.reduce((acc: Record<string, Søknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.navn || soknad.arbeidssituasjon || soknad.type

        acc[key] = acc[key] || []
        acc[key].push(soknad)
        return acc
    }, {})
    //TODO form
    return (
        <SaksbildePanel value={value}>
            <Label spacing>Velg hvilken søknad som skal behandles</Label>
            {Object.entries(søknaderGruppert).map(([key, gruppe]) => (
                <div key={key} className="mt-4">
                    <CheckboxGroup legend={key}>
                        {gruppe.map((søknad, j) => (
                            <Checkbox key={j}>
                                {getFormattedDateString(søknad.fom) + ' - ' + getFormattedDateString(søknad.tom)}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                </div>
            ))}
            <Select label="Hvilken inntektskategori tilhører søkeren?" className="my-8">
                {arbeidssituasjoner.map((situasjon) => (
                    <option key={situasjon} value={situasjon}>
                        {situasjon}
                    </option>
                ))}
            </Select>
            <Button size="small">Start behandling</Button>
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

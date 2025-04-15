import { PencilIcon, PersonIcon, TasklistIcon } from '@navikt/aksel-icons'
import { BodyShort, Timeline } from '@navikt/ds-react'
import dayjs from 'dayjs'
import React from 'react'

import { useBehandlinger } from '@hooks/queries/useBehandlinger'
import { useSoknader } from '@hooks/queries/useSoknader'
import { RSSoknad } from '@typer/soknad'

export const Tidslinje = () => {
    const { data: behandlinger } = useBehandlinger()
    const { data: soknader } = useSoknader()
    if (!behandlinger) return null
    if (behandlinger.length == 0 && soknader?.length == 0) return null

    // grupper søknader på orgnummer sekundært arbeidssituasjon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const soknaderGruppert = soknader?.reduce((acc: Record<string, RSSoknad[]>, soknad) => {
        const key = soknad.arbeidsgiver?.orgnummer || '' + soknad.arbeidssituasjon
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(soknad)
        return acc
    }, {})

    const alleDatoer = [] as string[]
    behandlinger.forEach((b) => {
        alleDatoer.push(b.fom)
        alleDatoer.push(b.tom)
    })
    soknader?.forEach((s) => {
        alleDatoer.push(s.fom!)
        alleDatoer.push(s.tom!)
    })
    const sortert = alleDatoer.sort()
    // sorter alle datoer og hent første og siste, eventuelt hardkodet fra dagens dato 2 måneder tilbake
    const forst = dayjs(sortert[0] || '2025-01-01').subtract(2, 'month')
    const sist = dayjs(sortert[sortert.length - 1] || '2025-03-31').add(1, 'week')

    return (
        <div className="w-100">
            <Timeline className="pt-8 pb-16 px-8" direction="right" startDate={forst.toDate()} endDate={sist.toDate()}>
                {behandlinger.length > 0 && (
                    <Timeline.Row label="Manuell behandling" icon={<PersonIcon aria-hidden />}>
                        {behandlinger.map((p, i) => (
                            <Timeline.Period
                                key={i}
                                start={new Date(p.fom)}
                                end={new Date(p.tom)}
                                status="info"
                                icon={<PencilIcon aria-hidden />}
                                statusLabel="Manuell behandling"
                            >
                                <BodyShort>Manuell behandling</BodyShort>
                                <BodyShort>{p.fom + ' ' + p.tom}</BodyShort>
                            </Timeline.Period>
                        ))}
                    </Timeline.Row>
                )}
                {Object.entries(soknaderGruppert || {}).map(([label, soknader]) => (
                    <Timeline.Row key={label} label={'Søknader ' + label} icon={<TasklistIcon aria-hidden />}>
                        {soknader.map((soknad, i) => (
                            <Timeline.Period
                                key={i}
                                start={new Date(soknad.fom!)}
                                end={new Date(soknad.tom!)}
                                status="success"
                                statusLabel="Sendt"
                            >
                                <BodyShort>{soknad.arbeidssituasjon}</BodyShort>
                                <BodyShort>{soknad.arbeidsgiver?.navn}</BodyShort>
                                <BodyShort>{soknad.fom + ' ' + soknad.tom}</BodyShort>
                            </Timeline.Period>
                        ))}
                    </Timeline.Row>
                ))}
            </Timeline>
        </div>
    )
}

import dayjs from 'dayjs'
import React, { ReactElement } from 'react'
import { VStack } from '@navikt/ds-react'

import { getFormattedDatetimeString, NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date-format'
import { Søknad } from '@/schemas/søknad'
import { Details } from '@components/sidemenyer/høyremeny/dokumenter/InntektsmeldingInnhold'

import { Spørsmål } from './Sporsmal'

type SøknadsinnholdProps = {
    søknad: Søknad
}

export function SøknadsInnhold({ søknad }: SøknadsinnholdProps): ReactElement {
    const formatEgenmeldingsdager = () =>
        søknad.egenmeldingsdagerFraSykmelding
            ?.map((it) => dayjs(it).format(NORSK_DATOFORMAT))
            .sort((a, b) => (dayjs(a, NORSK_DATOFORMAT).isAfter(dayjs(b, NORSK_DATOFORMAT)) ? 1 : -1))
            .join(', ')
            .replace(/,(?=[^,]*$)/, ' og')

    return (
        <VStack
            gap="4"
            role="region"
            aria-label={`Innhold for søknad opprettet: ${getFormattedDatetimeString(søknad.opprettet)}`}
        >
            <Details label="Type">{søknad.type?.replace(/_/g, ' ')}</Details>

            {søknad.soknadsperioder?.map((periode) => (
                <Details
                    key={periode.fom}
                    label={`${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(NORSK_DATOFORMAT)}`}
                >
                    {periode.grad || periode.sykmeldingsgrad
                        ? `${periode.grad || periode.sykmeldingsgrad} % sykmeldt`
                        : 'Sykmeldingsgrad ikke oppgitt'}
                    {periode.faktiskGrad && (
                        <>
                            <br />
                            Oppgitt faktisk arbeidsgrad {periode.faktiskGrad} %
                        </>
                    )}
                </Details>
            ))}

            <Details label="Arbeid gjenopptatt">
                {søknad.arbeidGjenopptatt && dayjs(søknad.arbeidGjenopptatt).format(NORSK_DATOFORMAT)}
            </Details>

            <Details label="Sykmelding skrevet">
                {søknad.sykmeldingSkrevet && dayjs(søknad.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
            </Details>

            <Details label="Egenmeldingsdager fra sykmelding">
                {(søknad.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 ? formatEgenmeldingsdager() : null}
            </Details>

            {søknad.sporsmal && <Spørsmål spørsmål={søknad.sporsmal} />}
        </VStack>
    )
}

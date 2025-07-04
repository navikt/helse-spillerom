import dayjs from 'dayjs'
import React, { ReactElement } from 'react'
import { BodyShort, Box, VStack } from '@navikt/ds-react'

import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date-format'
import { Søknad } from '@/schemas/søknad'

import { Spørsmål } from './Sporsmal'

type SøknadsinnholdProps = {
    søknad: Søknad
}

export const Søknadsinnhold = ({ søknad }: SøknadsinnholdProps): ReactElement => {
    return (
        <div>
            {søknad && (
                <Box.New background='raised' borderRadius={"large"} borderWidth='1' borderColor='neutral-subtle' className="flex flex-col gap-4 p-4">
                    {søknad.type && (
                        <VStack gap="2">
                            <BodyShort size="small" className="font-bold">
                                Type
                            </BodyShort>
                            <BodyShort size="small">{søknad.type.replace(/_/g, ' ')}</BodyShort>
                        </VStack>
                    )}
                    {søknad.soknadsperioder &&
                        søknad.soknadsperioder.length > 0 &&
                        søknad.soknadsperioder.map((søknadsperiode) => (
                            <VStack key={`søknadsperiode${søknadsperiode.fom}`} gap="2">
                                <BodyShort size="small" className="font-bold">
                                    {dayjs(søknadsperiode.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {dayjs(søknadsperiode.tom).format(NORSK_DATOFORMAT)}
                                </BodyShort>
                                <BodyShort size="small">
                                    {søknadsperiode.grad || søknadsperiode.sykmeldingsgrad ? (
                                        <>{søknadsperiode.grad || søknadsperiode.sykmeldingsgrad} % sykmeldt</>
                                    ) : (
                                        'Sykmeldingsgrad ikke oppgitt'
                                    )}
                                    {søknadsperiode.faktiskGrad && (
                                        <>
                                            <br />
                                            Oppgitt faktisk arbeidsgrad {søknadsperiode.faktiskGrad} %
                                        </>
                                    )}
                                </BodyShort>
                            </VStack>
                        ))}
                    {søknad.arbeidGjenopptatt && (
                        <VStack gap="2">
                            <BodyShort size="small" className="font-bold">
                                Arbeid gjenopptatt
                            </BodyShort>
                            <BodyShort size="small">
                                {dayjs(søknad.arbeidGjenopptatt).format(NORSK_DATOFORMAT)}
                            </BodyShort>
                        </VStack>
                    )}
                    {søknad.sykmeldingSkrevet && (
                        <VStack gap="2">
                            <BodyShort size="small" className="font-bold">
                                Sykmelding skrevet
                            </BodyShort>
                            <BodyShort size="small">
                                {dayjs(søknad.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                            </BodyShort>
                        </VStack>
                    )}
                    {(søknad.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 && (
                        <VStack gap="2">
                            <BodyShort size="small" className="font-bold">
                                Egenmeldingsdager fra sykmelding
                            </BodyShort>
                            <BodyShort size="small">
                                {søknad.egenmeldingsdagerFraSykmelding
                                    ?.map((it) => dayjs(it).format(NORSK_DATOFORMAT))
                                    .sort((a, b) =>
                                        dayjs(a, NORSK_DATOFORMAT).isAfter(dayjs(b, NORSK_DATOFORMAT)) ? 1 : -1,
                                    )
                                    .join(', ')
                                    .replace(/,(?=[^,]*$)/, ' og')}
                            </BodyShort>
                        </VStack>
                    )}
                    {søknad.sporsmal && <Spørsmål spørsmål={søknad.sporsmal} />}
                </Box.New>
            )}
        </div>
    )
}

import dayjs from 'dayjs'
import React, { ReactElement } from 'react'

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
                <div className="flex flex-col gap-4 rounded bg-gray-50 p-4">
                    {søknad.type && (
                        <div className="flex flex-col gap-2">
                            <h3 className="m-0 text-sm font-semibold text-gray-900">Type</h3>
                            <div className="text-sm leading-6 text-gray-700">{søknad.type.replace(/_/g, ' ')}</div>
                        </div>
                    )}
                    {søknad.soknadsperioder &&
                        søknad.soknadsperioder.length > 0 &&
                        søknad.soknadsperioder.map((søknadsperiode) => (
                            <div key={`søknadsperiode${søknadsperiode.fom}`} className="flex flex-col gap-2">
                                <h3 className="m-0 text-sm font-semibold text-gray-900">
                                    {dayjs(søknadsperiode.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {dayjs(søknadsperiode.tom).format(NORSK_DATOFORMAT)}
                                </h3>
                                <div className="text-sm leading-6 text-gray-700">
                                    {søknadsperiode.grad || søknadsperiode.sykmeldingsgrad ? (
                                        <>Sykegrad: {søknadsperiode.grad || søknadsperiode.sykmeldingsgrad} %</>
                                    ) : (
                                        'Sykmeldingsgrad ikke oppgitt'
                                    )}
                                    {søknadsperiode.faktiskGrad && (
                                        <>
                                            <br />
                                            Arbeidsgrad: {søknadsperiode.faktiskGrad} %
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    {søknad.arbeidGjenopptatt && (
                        <div className="flex flex-col gap-2">
                            <h3 className="m-0 text-sm font-semibold text-gray-900">Arbeid gjenopptatt</h3>
                            <div className="text-sm leading-6 text-gray-700">
                                {dayjs(søknad.arbeidGjenopptatt).format(NORSK_DATOFORMAT)}
                            </div>
                        </div>
                    )}
                    {søknad.sykmeldingSkrevet && (
                        <div className="flex flex-col gap-2">
                            <h3 className="m-0 text-sm font-semibold text-gray-900">Sykmelding skrevet</h3>
                            <div className="text-sm leading-6 text-gray-700">
                                {dayjs(søknad.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                            </div>
                        </div>
                    )}
                    {(søknad.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 && (
                        <div className="flex flex-col gap-2">
                            <h3 className="m-0 text-sm font-semibold text-gray-900">
                                Egenmeldingsdager fra sykmelding
                            </h3>
                            <div className="text-sm leading-6 text-gray-700">
                                {søknad.egenmeldingsdagerFraSykmelding
                                    ?.map((it) => dayjs(it).format(NORSK_DATOFORMAT))
                                    .sort((a, b) =>
                                        dayjs(a, NORSK_DATOFORMAT).isAfter(dayjs(b, NORSK_DATOFORMAT)) ? 1 : -1,
                                    )
                                    .join(', ')
                                    .replace(/,(?=[^,]*$)/, ' og')}
                            </div>
                        </div>
                    )}
                    {søknad.sporsmal && <Spørsmål spørsmål={søknad.sporsmal} />}
                </div>
            )}
        </div>
    )
}

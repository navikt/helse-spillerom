import dayjs from 'dayjs'
import React, { ReactElement } from 'react'

import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date-format'
import { Søknad } from '@/schemas/søknad'

import { Spørsmål } from './Sporsmal'
import styles from './Søknadsinnhold.module.css'

type SøknadsinnholdProps = {
    søknad: Søknad
}

export const Søknadsinnhold = ({ søknad }: SøknadsinnholdProps): ReactElement => {
    return (
        <div>
            {søknad && (
                <div className={styles.dokument}>
                    {søknad.type && (
                        <div className={styles.fragment}>
                            <h3 className={styles.overskrift}>Type</h3>
                            <div className={styles.innhold}>{søknad.type.replace(/_/g, ' ')}</div>
                        </div>
                    )}
                    {søknad.soknadsperioder &&
                        søknad.soknadsperioder.length > 0 &&
                        søknad.soknadsperioder.map((søknadsperiode) => (
                            <div key={`søknadsperiode${søknadsperiode.fom}`} className={styles.fragment}>
                                <h3 className={styles.overskrift}>
                                    {dayjs(søknadsperiode.fom).format(NORSK_DATOFORMAT)} –{' '}
                                    {dayjs(søknadsperiode.tom).format(NORSK_DATOFORMAT)}
                                </h3>
                                <div className={styles.innhold}>
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
                                </div>
                            </div>
                        ))}
                    {søknad.arbeidGjenopptatt && (
                        <div className={styles.fragment}>
                            <h3 className={styles.overskrift}>Arbeid gjenopptatt</h3>
                            <div className={styles.innhold}>
                                {dayjs(søknad.arbeidGjenopptatt).format(NORSK_DATOFORMAT)}
                            </div>
                        </div>
                    )}
                    {søknad.sykmeldingSkrevet && (
                        <div className={styles.fragment}>
                            <h3 className={styles.overskrift}>Sykmelding skrevet</h3>
                            <div className={styles.innhold}>
                                {dayjs(søknad.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                            </div>
                        </div>
                    )}
                    {(søknad.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 && (
                        <div className={styles.fragment}>
                            <h3 className={styles.overskrift}>Egenmeldingsdager fra sykmelding</h3>
                            <div className={styles.innhold}>
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

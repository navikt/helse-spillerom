export type KeyCode =
    | 'KeyA'
    | 'KeyB'
    | 'KeyC'
    | 'KeyD'
    | 'KeyE'
    | 'KeyF'
    | 'KeyG'
    | 'KeyL'
    | 'KeyM'
    | 'KeyO'
    | 'KeyR'
    | 'KeyS'

export type ModifierKey = 'Alt' | 'Shift' | 'Meta'

export type ShortcutId =
    | 'copy_aktør_id'
    | 'copy_fødselsnummer'
    | 'open_aa_reg'
    | 'open_brreg'
    | 'open_demoside_vedtak'
    | 'open_a_inntekt'
    | 'open_foreldrepenger'
    | 'open_gosys'
    | 'open_lovdata'
    | 'open_modia_personoversikt'
    | 'open_oppdrag'
    | 'open_rutiner'
    | 'open_modia_sykefraværsoppfølging'

export type ShortcutMetadata = {
    id: ShortcutId
    key: KeyCode
    modifier?: ModifierKey
    visningssnarvei: string[]
    visningstekst?: string
    externalLinkTekst?: string
    ignoreIfModifiers?: boolean
}

export const shortcutMetadata: ShortcutMetadata[] = [
    {
        id: 'copy_aktør_id',
        key: 'KeyA',
        modifier: 'Alt',
        visningssnarvei: ['ALT', 'A'],
        visningstekst: 'Kopier aktør-ID',
        ignoreIfModifiers: false,
    },
    {
        id: 'copy_fødselsnummer',
        key: 'KeyC',
        modifier: 'Alt',
        visningssnarvei: ['ALT', 'C'],
        visningstekst: 'Kopier fødselsnummer',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_aa_reg',
        key: 'KeyA',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'A'],
        visningstekst: 'Åpne Aa-reg',
        externalLinkTekst: 'Aa-registeret',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_brreg',
        key: 'KeyB',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'B'],
        visningstekst: 'Åpne Brreg',
        externalLinkTekst: 'Brønnøysundregisteret',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_demoside_vedtak',
        key: 'KeyD',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'D'],
        visningstekst: 'Åpne demoside for vedtak',
        externalLinkTekst: 'Demoside for vedtak',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_a_inntekt',
        key: 'KeyE',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'E'],
        visningstekst: 'Åpne A-inntekt',
        externalLinkTekst: 'A-inntekt',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_foreldrepenger',
        key: 'KeyF',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'F'],
        visningstekst: 'Åpne Foreldrepenger',
        externalLinkTekst: 'Foreldrepenger',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_gosys',
        key: 'KeyG',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'G'],
        visningstekst: 'Åpne Gosys',
        externalLinkTekst: 'Gosys',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_lovdata',
        key: 'KeyL',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'L'],
        visningstekst: 'Åpne Lovdata',
        externalLinkTekst: 'Folketrygdloven kapittel 8',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_modia_personoversikt',
        key: 'KeyM',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'M'],
        visningstekst: 'Åpne Modia Personoversikt',
        externalLinkTekst: 'Modia Personoversikt',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_oppdrag',
        key: 'KeyO',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'O'],
        visningstekst: 'Åpne oppdrag',
        externalLinkTekst: 'Oppdrag',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_rutiner',
        key: 'KeyR',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'R'],
        visningstekst: 'Åpne rutiner for sykepenger',
        externalLinkTekst: 'Rutiner for sykepenger',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_modia_sykefraværsoppfølging',
        key: 'KeyS',
        modifier: 'Shift',
        visningssnarvei: ['⇧', 'S'],
        visningstekst: 'Åpne Modia Sykefraværsoppfølging',
        externalLinkTekst: 'Modia Sykefraværsoppfølging',
        ignoreIfModifiers: false,
    },
]

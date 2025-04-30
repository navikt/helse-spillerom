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
    visningstekst?: string
    externalLinkTekst?: string
    ignoreIfModifiers?: boolean
}

export const shortcutMetadata: ShortcutMetadata[] = [
    {
        id: 'copy_aktør_id',
        key: 'KeyA',
        modifier: 'Alt',
        visningstekst: 'Kopier aktør-ID',
        ignoreIfModifiers: false,
    },
    {
        id: 'copy_fødselsnummer',
        key: 'KeyC',
        modifier: 'Alt',
        visningstekst: 'Kopier fødselsnummer',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_aa_reg',
        key: 'KeyA',
        modifier: 'Shift',
        visningstekst: 'Åpne Aa-reg',
        externalLinkTekst: 'Aa-registeret',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_brreg',
        key: 'KeyB',
        modifier: 'Shift',
        visningstekst: 'Åpne Brreg',
        externalLinkTekst: 'Brønnøysundregisteret',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_demoside_vedtak',
        key: 'KeyD',
        modifier: 'Shift',
        visningstekst: 'Åpne demoside for vedtak',
        externalLinkTekst: 'Demoside for vedtak',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_a_inntekt',
        key: 'KeyE',
        modifier: 'Shift',
        visningstekst: 'Åpne A-inntekt',
        externalLinkTekst: 'A-inntekt',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_foreldrepenger',
        key: 'KeyF',
        modifier: 'Shift',
        visningstekst: 'Åpne Foreldrepenger',
        externalLinkTekst: 'Foreldrepenger',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_gosys',
        key: 'KeyG',
        modifier: 'Shift',
        visningstekst: 'Åpne Gosys',
        externalLinkTekst: 'Gosys',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_lovdata',
        key: 'KeyL',
        modifier: 'Shift',
        visningstekst: 'Åpne Lovdata',
        externalLinkTekst: 'Folketrygdloven kapittel 8',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_modia_personoversikt',
        key: 'KeyM',
        modifier: 'Shift',
        visningstekst: 'Åpne Modia Personoversikt',
        externalLinkTekst: 'Modia Personoversikt',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_oppdrag',
        key: 'KeyO',
        modifier: 'Shift',
        visningstekst: 'Åpne Oppdrag',
        externalLinkTekst: 'Oppdrag',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_rutiner',
        key: 'KeyR',
        modifier: 'Shift',
        visningstekst: 'Åpne rutiner for sykepenger',
        externalLinkTekst: 'Rutiner for sykepenger',
        ignoreIfModifiers: false,
    },
    {
        id: 'open_modia_sykefraværsoppfølging',
        key: 'KeyS',
        modifier: 'Shift',
        visningstekst: 'Åpne Modia Sykefraværsoppfølging',
        externalLinkTekst: 'Modia Sykefraværsoppfølging',
        ignoreIfModifiers: false,
    },
]

export const modifierLabels: Record<ModifierKey, string> = {
    Alt: isMacOS() ? '⌥' : 'ALT',
    Shift: '⇧',
    Meta: isMacOS() ? '⌘' : 'CTRL',
}

export function keyCodeLabel(code: KeyCode): string {
    if (code.includes('Key')) {
        return code.replace('Key', '')
    } else {
        return 'Du må oppdatere keyCodeLabel for å støtte denne KeyCode-en'
    }
}

interface NavigatorUAData {
    platform: string
}

interface NavigatorWithUAData extends Navigator {
    userAgentData?: NavigatorUAData
}

function isMacOS(): boolean {
    const nav = navigator as NavigatorWithUAData
    const platform = nav.userAgentData?.platform ?? navigator.userAgent
    return platform.toLowerCase().includes('mac')
}

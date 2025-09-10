import { type HovedspørsmålArray } from '@schemas/saksbehandlergrensesnitt'

export const saksbehandlerUi: HovedspørsmålArray = [
    {
        kode: 'KRAV_RETTIDIG_FRAMSATT',
        beskrivelse: 'Frist for framsetting av krav',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'KRAV_FRAMSATT_HELT_ELLER_DELVIS_I_TIDE',
                navn: 'Er vilkåret oppfylt for hele eller deler av perioden?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'efdcd5d4-9df5-4e63-ba9a-b97cab307442',
                        navn: 'Ja, for hele perioden',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'KRAV_FRAMSATT_I_TIDE_HELE_PERIODEN_JA_BEGRUNNELSE',
                                navn: 'Velg begrunnelse',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'KRAV_FRAMSATT_I_TIDE_HELE_PERIODEN_JA_TRE_MÅNEDER',
                                        navn: 'Søkt innen tre måneder',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'KRAV_FRAMSATT_I_TIDE_HELE_PERIODEN_JA_TRE_ÅR_IKKE_I_STAND',
                                        navn: 'Søkt innen tre år, ikke vært i stand til å søke tidligere',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'KRAV_FRAMSATT_INNEN_TRE_AAR_FOR_DELER_AV_PERIODEN_PGA_MISVISENDE_OPPLYSNINGER',
                                        navn: 'Søkt innen tre år, misvisende opplysninger',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kode: 'KRAV_FRAMSATT_I_TIDE_DELER_AV_PERIODEN_JA',
                        navn: 'Ja, for deler av perioden',
                        harUnderspørsmål: false,
                        underspørsmål: [
                            {
                                kode: 'KRAV_FRAMSATT_I_TIDE_DELER_AV_PERIODEN_JA_BEGRUNNELSE',
                                navn: 'Velg begrunnelse',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'KRAV_FRAMSATT_I_TIDE_DELER_AV_PERIODEN_JA_TRE_MÅNEDER',
                                        navn: 'Søkt innen tre måneder',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'KRAV_FRAMSATT_I_TIDE_DELER_AV_PERIODEN_JA_TRE_ÅR_IKKE_I_STAND',
                                        navn: 'Søkt innen tre år, ikke vært i stand til å søke tidligere',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'KRAV_FRAMSATT_I_TIDE_DELER_AV_PERIODEN_JA_TRE_ÅR_MISVISENDE_OPPLYSNINGER',
                                        navn: 'Søkt innen tre år, misvisende opplysninger',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kode: 'KRAV_FRAMSATT_I_TIDE_NEI',
                        navn: 'Nei',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'MEDLEMSKAP',
        beskrivelse: 'Kapittel 2 - Medlemskap i folketrygden',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'MEDLEMSKAP_ALTERNATIVER',
                navn: 'Er den sykmeldte medlem i folketrygden?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'MEDLEMSKAP_JA',
                        navn: 'Ja',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'MEDLEMSKAP_NEI',
                        navn: 'Nei',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'OPPTJENING',
        beskrivelse: '§ 8-2 - Opptjeningstid',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'OPPTJENING_OPPFYLT',
                navn: 'Oppfyller vilkår om opptjeningstid',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'ab6e09a4-e770-4a0d-a63c-872f640b8b1a',
                        navn: 'Ja',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'OPPTJENING_OPPFYLT_JA_ALTERNATIVER',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'OPPTJENING_MINST_4_UKER',
                                        navn: 'Minst fire uker i arbeid umiddelbart før arbeidsuførhet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_ANNEN_YTELSE',
                                        navn: 'Mottak av ytelse som er likestilt med arbeid',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_YRKESAKTIV_FOER_FORELDREPENGER',
                                        navn: 'Forutgående foreldrepenger opptjent på grunnlag av arbeidsavklaringspenger, men personen har vært sammenhengende yrkesaktiv (eller mottatt ytelse etter kapittel 8, 9 eller 14) i minst fire uker umiddelbart før uttaket av foreldrepenger startet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_COVID',
                                        navn: 'Mottak av covid-ytelse',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kode: 'f227f4f9-bfd4-41be-b314-17cefb4f8d0d',
                        navn: 'Nei',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'OPPTJENING_OPPFYLT_NEI_ALTERNATIVER',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'IKKE_OPPTJENING_ARBEID_ELLER_YTELSE',
                                        navn: 'Ikke arbeid eller likestilt ytelse umiddelbart før arbeidsuførhet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_AAP_FOR_FORELDREPENGER',
                                        navn: 'Forutgående foreldrepenger opptjent på grunnlag av arbeidsavklaringspenger, og personen har ikke vært sammenhengende yrkesaktiv (eller mottatt ytelse etter kapittel 8, 9 eller 14) i minst fire uker umiddelbart før uttaket av foreldrepenger startet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kode: '191798df-6a0e-4eb0-830a-e83acb253401',
                        navn: 'Ikke aktuelt / unntak',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'OPPTJENING_OPPFYLT_UNNTAK_ALTERNATIVER',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'ARBUFOR_SKIP_OPPFYLT',
                                        navn: 'Ansatt på et norsk skip i utenriksfart',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_UNNTAK_FISKER',
                                        navn: 'Fisker som er tatt opp på blad B i fiskermanntallet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_UNNTAK_MILITARTJENESTE',
                                        navn: 'Utført militærtjeneste hvor arbeidsuførheten oppstod under tjenesten',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'OPPTJENING_UNNTAK_YRKESSKADE',
                                        navn: 'Arbeidsufør på grunn av en godkjent yrkesskade',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        kode: 'INNTEKTSTAP_OG_MINSTEINNTEKT',
        beskrivelse: '§ 8-3 - Tap av pensjonsgivende inntekt og minsteinntekt',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'INNTEKTSTAP',
                navn: 'Tap av pensjonsgivende inntekt på grunn av arbeidsuførhet',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'TAPTINNTEKT',
                        navn: 'Ja',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'IKKE_TAPTINNTEKT',
                        navn: 'Nei',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
            {
                kode: 'HALVG',
                navn: 'Sykepengegrunnlaget utgjør minst 50 prosent av grunnbeløpet',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'MINSTEINNTEKT',
                        navn: 'Ja',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'IKKE_MINSTEINNTEKT',
                        navn: 'Nei',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
            {
                kode: 'FYLT_70_GRUPPE',
                navn: 'Spesielle avslagsgrunner',
                variant: 'CHECKBOX',
                alternativer: [
                    {
                        kode: 'MAXALDER',
                        navn: 'Fylt 70 år',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'AVSLUTTET_AKTIVITET',
                        navn: 'Trukket seg tilbake fra arbeidslivet',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'ARBEIDSUFØR',
        beskrivelse: '§ 8-4 - Arbeidsuførhet',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'ARBEIDSUFØRHET',
                navn: 'Er vilkåret om arbeidsuførhet oppfylt?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: '04999541-b6b3-4e25-9969-5021ec06b795',
                        navn: 'Ja',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'ARBEIDSUFØRHET_JA_ALTERNATIVER',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'ARBUFOR_FUNK',
                                        navn: 'Arbeidsufør på grunn av en funksjonsnedsettelse som klart skyldes sykdom eller skade',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_INSTITUSJON',
                                        navn: 'Innlagt i en godkjent helseinstitusjon',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_BEHANDLING',
                                        navn: 'Under behandling og legen erklærer at behandlingen gjør det nødvendig at vedkommende ikke arbeider',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_TILTAK',
                                        navn: 'Deltar på et arbeidsrettet tiltak',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_TILSKOTT',
                                        navn: 'På grunn av sykdom, skade eller lyte får tilskott til opplæringstiltak etter § 10-7 tredje ledd',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_KONTROLL',
                                        navn: 'Nødvendig kontrollundersøkelse som krever minst 24 timers fravær, reisetid medregnet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_SMITTE',
                                        navn: 'Myndighet har nedlagt forbud mot at han eller hun arbeider på grunn av smittefare',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_SVANGERSKAPSAVBRUDD',
                                        navn: 'Arbeidsufør som følge av svangerskapsavbrudd',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_BARNLOSHET',
                                        navn: 'Arbeidsufør som følge av behandling for barnløshet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_DONOR',
                                        navn: 'Donor eller er under vurdering som donor',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_STERILISERING',
                                        navn: 'Arbeidsufør som følge av behandling i forbindelse med sterilisering',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'ARBUFOR_KOSM',
                                        navn: 'Medisinsk begrunnet kosmetisk inngrep',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        kode: '02412c53-a51b-4461-a815-d1a84664377a',
                        navn: 'Nei',
                        harUnderspørsmål: true,
                        underspørsmål: [
                            {
                                kode: 'ARBEIDSUFØRHET_NEI_ALTERNATIVER',
                                variant: 'RADIO',
                                alternativer: [
                                    {
                                        kode: 'IKKE_ARBUFOR_FUNK',
                                        navn: 'Ikke arbeidsufør på grunn av en funksjonsnedsettelse som klart skyldes sykdom eller skade',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                    {
                                        kode: 'IKKE_ARBUFOR_KOSMETISK_IKKE_MED_BEGRUNNET',
                                        navn: 'Kosmetisk inngrep som ikke er medisinsk begrunnet',
                                        harUnderspørsmål: false,
                                        underspørsmål: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        kode: 'FRISKMELDING_TIL_ARBEIDSFORMIDLING',
        beskrivelse: 'Sykepenger ved friskmelding til arbeidsformidling',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'FRISKMELDING_TIL_ARBEIDSFORMIDLING_ALTERNATIVER',
                navn: 'Er vilkårene oppfylt?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'FRISKMELDING_TIL_ARBEIDSFORMIDLING_JA',
                        navn: 'Ja, personen er av helsemessige grunner ikke i stand til å utføre sitt arbeid, men er ellers arbeidsfør. Personen har også meldt seg som arbeidssøker hos Arbeids- og velferdsetaten og et eventuelt arbeidsforhold har opphørt i samsvar med arbeidsmiljølovens bestemmelser',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'FRISKMELDING_TIL_ARBEIDSFORMIDLING_NEI',
                        navn: 'Nei',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'GRADERT_SYKMELDING',
        beskrivelse: 'Gradert sykmelding',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
    {
        kode: 'DOKUMENTASJON_AV_ARBEIDSUFØRHET',
        beskrivelse: 'Dokumentasjon av arbeidsuførhet',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
    {
        kode: 'OPPFØLGING',
        beskrivelse: 'Oppfølging mv. i regi av Arbeids- og velferdsetaten',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
    {
        kode: 'MEDVIRKNING',
        beskrivelse: 'Medlemmets medvirkning',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'MEDVIRKNING_IKKE_OPPFYLT',
                variant: 'CHECKBOX',
                alternativer: [
                    {
                        kode: 'MEDVIRKNING_IKKE_OPPFYLT_OPPLYSNINGER_OG_UTREDNING',
                        navn: 'Personen nekter å gi opplysninger eller medvirke til utredning, eller uten rimelig grunn nekter å ta imot tilbud om behandling, rehabilitering, tilrettelegging av arbeid og arbeidsutprøving eller arbeidsrettede tiltak ',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'MEDVIRKNING_IKKE_OPPFYLT_OPPFØLGING_OG_AKTIVITET',
                        navn: 'Personen unnlater å medvirke ved utarbeiding og gjennomføring av oppfølgingsplaner, unnlater å delta i dialogmøter eller unnlater å være i arbeidsrelatert aktivitet',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'OPPHOLDSKRAV',
        beskrivelse: 'Oppholdskrav',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
    {
        kode: 'SYKEPENGEGRUNNLAG',
        beskrivelse: 'Sykepengegrunnlag',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
    {
        kode: 'SYKEPENGEDAGER',
        beskrivelse: 'Sykepengedager',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
    {
        kode: 'SYKEPENGEDAGER_IGJEN',
        beskrivelse: 'Antall sykepengedager',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'SYKEPENGEDAGER_IGJEN_ALTERNATIVER',
                navn: 'Har personen flere sykepengedager igjen?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'SYKEPENGEDAGER_IGJEN_HELE',
                        navn: 'Ja, sykepengedager igjen for hele perioden',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'SYKEPENGEDAGER_IGJEN_DELER',
                        navn: 'Ja, sykepengedager igjen for deler av perioden',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'SYKEPENGEDAGER_IGJEN_INGEN',
                        navn: 'Nei, tidligere fått utbetalt sykepenger til maksdato og ikke opptjent ny rett til sykepenger',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'GRADERTE_SYKEPENGER',
        beskrivelse: 'Graderte sykepenger',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [
            {
                kode: 'GRADERTE_SYKEPENGER_ARBEIDSUFØR',
                navn: 'Er personens evne til å utføre inntektsgivende arbeid nedsatt med minst 20 prosent?',
                variant: 'RADIO',
                alternativer: [
                    {
                        kode: 'GRADERTE_SYKEPENGER_ARBEIDSUFØR_HELE',
                        navn: 'Ja, for hele perioden',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'GRADERTE_SYKEPENGER_ARBEIDSUFØR_DELER',
                        navn: 'Ja, for deler av perioden',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                    {
                        kode: 'GRADERTE_SYKEPENGER_ARBEIDSUFØR_INGEN',
                        navn: 'Nei, evnen er nedsatt med mindre enn 20 prosent for hele perioden',
                        harUnderspørsmål: false,
                        underspørsmål: [],
                    },
                ],
            },
        ],
    },
    {
        kode: 'ARBEIDSREISER',
        beskrivelse: 'Tilskott til arbeidsreiser',
        kategori: 'generelle_bestemmelser',
        underspørsmål: [],
    },
]

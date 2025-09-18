// Hardkodet mapp av organisasjonsnummer til organisasjonsnavn basert på testdata
export const organisasjonsnavnMap: Record<string, string> = {
    '987654321': 'Kranførerkompaniet',
    '123456789': 'Krankompisen',
    '889955555': 'Danskebåten',
    '972674818': 'Pengeløs Sparebank',
    '222222222': 'Ruter, avd Nesoddbåten',
    '805824352': 'Vegansk slakteri',
    '896929119': 'Sauefabrikk',
    '947064649': 'Sjokkerende elektriker',
    '967170232': 'Snill torpedo',
    '839942907': 'Hårreisende frisør',
    '907670201': 'Klonelabben',
    '999999991': 'Murstein AS',
    '999999992': 'Betongbygg AS',
}

export const organisasjonerForSelect = Object.entries(organisasjonsnavnMap).map(([orgnummer, navn]) => ({
    value: orgnummer,
    label: `${orgnummer} - ${navn}`,
}))

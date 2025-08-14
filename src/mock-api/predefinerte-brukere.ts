import { Bruker } from '@/schemas/bruker'

export const predefinerteBrukere: Bruker[] = [
    {
        navn: 'Saks McBehandlersen',
        navIdent: 'Z123456',
        preferredUsername: 'saks.mcbehandlersen@nav.no',
        roller: ['SAKSBEHANDLER'],
    },
    {
        navn: 'Vetle Veileder',
        navIdent: 'V987654',
        preferredUsername: 'vetle.veileder@nav.no',
        roller: ['LES'],
    },
    {
        navn: 'Berit Beslutter',
        navIdent: 'B456789',
        preferredUsername: 'berit.beslutter@nav.no',
        roller: ['BESLUTTER'],
    },
    {
        navn: 'Kai Kombinator',
        navIdent: 'K111222',
        preferredUsername: 'kai.kombinator@nav.no',
        roller: ['SAKSBEHANDLER', 'BESLUTTER'],
    },
]

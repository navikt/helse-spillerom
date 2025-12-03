import { useKodeverk } from '@/hooks/queries/useKodeverk'
import { useVilkaarsvurderinger } from '@/hooks/queries/useVilkaarsvurderinger'

export interface Avslagsdag {
    kode: string
    beskrivelse: string
}

/**
 * Hook som returnerer tilgjengelige avslagsdager basert på vilkårsvurderinger
 * som har resultert i IKKE_OPPFYLT og hvor årsakskodene finnes i kodeverkets ikkeOppfylt-liste
 */
export function useTilgjengeligeAvslagsdager(): Avslagsdag[] {
    const { data: kodeverk = [] } = useKodeverk()
    const { data: vilkårsvurderinger = [] } = useVilkaarsvurderinger()

    // Samle alle årsakskoder som er valgt i vilkårsvurderinger med IKKE_OPPFYLT
    const avslagsdagerMap = new Map<string, Avslagsdag>()

    vilkårsvurderinger.forEach((vurdering) => {
        if (vurdering.vurdering === 'IKKE_OPPFYLT') {
            vurdering.underspørsmål.forEach((underspørsmål) => {
                // Finn årsaken i kodeverket for å få beskrivelse
                for (const vilkår of kodeverk) {
                    const årsak = vilkår.ikkeOppfylt.find((årsak) => årsak.kode === underspørsmål.svar)
                    if (årsak) {
                        avslagsdagerMap.set(årsak.kode, {
                            kode: årsak.kode,
                            beskrivelse: årsak.beskrivelse,
                        })
                        break
                    }
                }
            })
        }
    })

    return Array.from(avslagsdagerMap.values()).sort((a, b) => a.kode.localeCompare(b.kode))
}

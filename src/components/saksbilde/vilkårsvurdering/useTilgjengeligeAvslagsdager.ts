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

    const ikkeOppfyltKoder = kodeverk.flatMap((vilkår) => vilkår.ikkeOppfylt)
    const kodeverkMap = new Map(ikkeOppfyltKoder.map((årsak) => [årsak.kode, årsak]))

    const avslagsdager = vilkårsvurderinger
        .filter((vurdering) => vurdering.vurdering === 'IKKE_OPPFYLT')
        .flatMap((vurdering) => vurdering.underspørsmål)
        .reduce((map, underspørsmål) => {
            const årsak = kodeverkMap.get(underspørsmål.svar)
            if (årsak && !map.has(årsak.kode)) {
                map.set(årsak.kode, { kode: årsak.kode, beskrivelse: årsak.beskrivelse })
            }
            return map
        }, new Map<string, Avslagsdag>())

    return Array.from(avslagsdager.values()).sort((a, b) => a.kode.localeCompare(b.kode))
}

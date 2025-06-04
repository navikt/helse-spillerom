import * as XLSX from 'xlsx'
import { Kodeverk, kodeverk } from '../src/components/saksbilde/vilkårsvurdering/kodeverk'

function beregnKolonnebredder(data: Record<string, string>[]) {
    const colWidths: any[] = []

    if (data.length === 0) return []

    const headers = Object.keys(data[0])
    headers.forEach((key, colIndex) => {
        let maxLen = key.length
        for (const row of data) {
            const cell = (row as Record<string, any>)[key]
            const cellLen = cell ? String(cell).length : 0
            if (cellLen > maxLen) {
                maxLen = cellLen
            }
        }

        // Sett bredden med en liten buffer
        colWidths[colIndex] = { wch: maxLen + 2 }
    })

    return colWidths
}

function kodeverkTilExcel(kodeverk: Kodeverk) {
    const rows: Record<string, string>[] = []
    for (const vilkår of kodeverk) {
        const hjemmel = vilkår.vilkårshjemmel
        const resultater = []
        type ResultatType = 'OPPFYLT' | 'IKKE_OPPFYLT' | 'IKKE_RELEVANT'

        for (const type of ['OPPFYLT', 'IKKE_OPPFYLT', 'IKKE_RELEVANT'] as ResultatType[]) {
            if (!vilkår.mulige_resultater[type]) continue
            for (const årsak of vilkår.mulige_resultater[type]) {
                resultater.push({
                    resultatType: type,
                    årsakKode: årsak.kode,
                    årsakBeskrivelse: årsak.beskrivelse,
                    årsakLovverk: årsak.vilkårshjemmel?.lovverk || '',
                    årsakLovverkversjon: årsak.vilkårshjemmel?.lovverksversjon || '',
                    årsakParagraf: årsak.vilkårshjemmel?.paragraf || '',
                    årsakLedd: årsak.vilkårshjemmel?.ledd || '',
                    årsakSetning: årsak.vilkårshjemmel?.setning || '',
                    årsakBokstav: årsak.vilkårshjemmel?.bokstav || '',
                })
            }
        }

        resultater.forEach((res, index) => {
            rows.push({
                vilkårskode: index === 0 ? vilkår.vilkårskode : '',
                beskrivelse: index === 0 ? vilkår.beskrivelse : '',
                lovverk: index === 0 ? hjemmel.lovverk : '',
                lovverksversjon: index === 0 ? hjemmel.lovverksversjon : '',
                paragraf: index === 0 ? hjemmel.paragraf : '',
                ledd: index === 0 ? hjemmel.ledd || '' : '',
                setning: index === 0 ? hjemmel.setning || '' : '',
                bokstav: index === 0 ? hjemmel.bokstav || '' : '',
                resultatType: res.resultatType,
                årsakKode: res.årsakKode,
                årsakBeskrivelse: res.årsakBeskrivelse,
                årsakLovverk: res.årsakLovverk,
                årsakParagraf: res.årsakParagraf,
            })
        })
    }

    const worksheet = XLSX.utils.json_to_sheet(rows)
    worksheet['!cols'] = beregnKolonnebredder(rows)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kodeverk')
    XLSX.writeFile(workbook, 'kodeverk.xlsx')
}

kodeverkTilExcel(kodeverk)

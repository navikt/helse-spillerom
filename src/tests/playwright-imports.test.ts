/* eslint-disable no-console */
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

import { describe, it, expect } from 'vitest'

describe('🛡️ UU-Validering Import Checker', () => {
    it('skal sikre at alle Playwright-tester importerer test fra fixtures/test (ikke direkte fra @playwright/test)', async () => {
        const playwrightDir = join(__dirname, '../../playwright')
        const files = await readdir(playwrightDir)

        // Finn alle .spec.ts filer
        const testFiles = files.filter((file) => file.endsWith('.spec.ts'))

        const violations: string[] = []

        for (const file of testFiles) {
            const filePath = join(playwrightDir, file)
            const content = await readFile(filePath, 'utf-8')

            // Sjekk for direkte import fra @playwright/test
            const directImportRegex = /import\s+.*from\s+['"]@playwright\/test['"]/
            const correctImportRegex = /import\s+.*from\s+['"]\.\/(?:test|fixtures)['"]/

            const hasDirectImport = directImportRegex.test(content)
            const hasCorrectImport = correctImportRegex.test(content)

            if (hasDirectImport && !hasCorrectImport) {
                violations.push(file)
            }
        }

        if (violations.length > 0) {
            const errorMessage = `
🚨 Følgende Playwright-tester importerer IKKE fra fixtures/test og får derfor IKKE automatisk UU-validering:

${violations.map((file) => `  ❌ ${file}`).join('\n')}

🛠️  Fiks dette ved å endre:
   
   ❌ import { test, expect } from '@playwright/test'
   ✅ import { test, expect } from './test'
   
   eller
   
   ✅ import { test, expect } from './fixtures'

🛡️  Dette sikrer automatisk UU-validering for alle tester!
            `.trim()

            expect(violations).toEqual([])
            console.log(errorMessage)
        }

        console.log(`✅ Alle ${testFiles.length} Playwright-tester importerer korrekt og har UU-validering aktivert!`)
    })

    it('skal sjekke at fixtures.ts eksisterer (test.ts er valgfri)', async () => {
        const playwrightDir = join(__dirname, '../../playwright')
        const files = await readdir(playwrightDir)

        // fixtures.ts er påkrevd
        expect(files).toContain('fixtures.ts')

        // Sjekk at fixtures.ts eksporterer test
        const fixturesContent = await readFile(join(playwrightDir, 'fixtures.ts'), 'utf-8')
        expect(fixturesContent).toMatch(/export\s+.*test/)

        // test.ts er valgfri, men hvis den eksisterer, sjekk at den eksporterer riktig
        if (files.includes('test.ts')) {
            const testTsContent = await readFile(join(playwrightDir, 'test.ts'), 'utf-8')
            expect(testTsContent).toMatch(/export\s+.*test/)
            expect(testTsContent).toMatch(/export\s+.*expect/)
            console.log('✅ Både test.ts og fixtures.ts eksisterer og eksporterer korrekt!')
        } else {
            console.log('✅ fixtures.ts eksisterer og eksporterer korrekt! (test.ts er valgfri)')
        }
    })

    it('skal sjekke at uuvalidering.ts eksisterer og eksporterer validerAxe', async () => {
        const playwrightDir = join(__dirname, '../../playwright')
        const files = await readdir(playwrightDir)

        expect(files).toContain('uuvalidering.ts')

        const uuContent = await readFile(join(playwrightDir, 'uuvalidering.ts'), 'utf-8')
        expect(uuContent).toMatch(/export\s+.*function\s+validerAxe/)

        console.log('✅ uuvalidering.ts eksisterer og eksporterer validerAxe!')
    })
})

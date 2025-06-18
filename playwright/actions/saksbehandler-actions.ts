import { Page } from '@playwright/test'

export function tilFørstesiden({ clearCookies }: { clearCookies: boolean } = { clearCookies: true }) {
    return async (page: Page) => {
        if (!clearCookies) {
            await page.context().clearCookies()
        }
        await page.goto('/')
    }
}

export function søkPerson(ident: string) {
    return async (page: Page) => {
        const main = page.locator('main')
        const searchInput = main.getByRole('searchbox', { name: 'Fødselsnummer/Aktør-ID' })
        await searchInput.fill(ident)
        await searchInput.press('Enter')
    }
}

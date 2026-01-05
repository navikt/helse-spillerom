# Spillerom
[![Bygg og deploy Spillerom](https://github.com/navikt/helse-spillerom/actions/workflows/workflow.yml/badge.svg)](https://github.com/navikt/helse-bakrommet/actions/workflows/main.yml)

## Beskrivelse
Frontend for backenden bakrommet

## Kjør lokalt
`pnpm run dev`

### Tilgang til Github Package Registry

Siden vi bruker avhengigheter som ligger i GPR, så må man sette opp tilgang til GPR med en PAT (personal access token) som har `read:packages`. Du kan [opprette PAT her](https://github.com/settings/tokens). Dersom du har en PAT som du bruker for tilgang til maven-packages i github kan du gjenbruke denne.

I din `.bashrc` eller `.zshrc`, sett følgende miljøvariabel:

`export NPM_AUTH_TOKEN=<din PAT med read:packages>`

## Henvendelser
Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

### For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen [#team-bømlo-værsågod](https://nav-it.slack.com/archives/C019637N90X).

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

### Custom Agents

Repoet har tilpassede agenter for spesialiserte oppgaver:

- **Playwright Tester** (`.github/agents/playwright-tester.agent.yml`) - Skriver, debugger og fikser Playwright E2E-tester
  - Krever NPM_AUTH_TOKEN med `read:packages` scope
  - Forstår repoets testmønstre og bruker eksisterende test-actions
  - Kan kjøre tester og analysere feil

Se `.github/copilot-instructions.md` for mer informasjon om agentene.

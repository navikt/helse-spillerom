import React, { ReactElement } from 'react'

import { KeyCode, keyCodeLabel, ModifierKey, modifierLabels } from '../tastatursnarveier/shortcutMetadata'

interface ShortcutProps {
    keyCode: KeyCode
    modifier?: ModifierKey
}

export function Shortcut({ keyCode, modifier }: ShortcutProps): ReactElement {
    return (
        <div className="aksel-action-menu__marker aksel-action-menu__marker--right inline-flex">
            {modifier && <span className="aksel-action-menu__shortcut">{modifierLabels[modifier]}</span>}
            <span className="aksel-action-menu__shortcut">{keyCodeLabel(keyCode)}</span>
        </div>
    )
}

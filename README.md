## Features

MetaGo provides fast cursor movement/selection for keyboard focused users: 
* go to any character on screen with 3 or 4 times key press.
* moving cursor up/down between blank lines.
* select code block when moving cursor while hold shift key.
* scroll the active line (contains cursor) to the screen center.


### go to any character on screen
![MetaGo.MetaJump](images/metago.jump.gif)
### scroll active line to the screen center
![MetaGo.Center](images/metago.center.gif)
### moving cursor up/down between blank lines
![MetaGo.blankLine](images/metago.blankLine.gif)
## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

To configure the keybinding, add the following lines to keybindings.json (File -> Preferences -> Keyboard Shortcuts):
![shortcuts](images/shortcutSetting.png)

        {
            "command": "extension.metaGo.input.cancel",
            "key": "escape",
            "when": "editorTextFocus && metaGoInput"
        },
        {
            "command": "extension.metaGo",
            "key": "alt+;",
            "when": "editorTextFocus"
        },
        {
            "command": "extension.metaGo.selection",
            "key": "alt+shift+;",
            "when": "editorTextFocus"
        },
        {
            "command": "extension.metaGo.centerEditor",
            "key": "alt+o",
            "when": "editorTextFocus"
        },
        {
            "key": "alt+home",
            "command": "extension.metaGo.spaceBlockMoveUp",
            "when": "editorTextFocus"
        },
        {
            "key": "alt+shift+home",
            "command": "extension.metaGo.spaceBlockSelectUp",
            "when": "editorTextFocus"
        },
        {
            "key": "alt+end",
            "command": "extension.metaGo.spaceBlockMoveDown",
            "when": "editorTextFocus"
        },
        {
            "key": "alt+shift+end",
            "command": "extension.metaGo.spaceBlockSelectDown",
            "when": "editorTextFocus"
        }
## extension Settings

        "metaGo.decoration.backgroundColor": {
            "type": "string",
            "default": "Chartreuse,yellow"
        },
        "metaGo.decoration.backgroundOpacity": {
            "type": "string",
            "default": "0.88"
        },
        "metaGo.decoration.borderColor": {
            "type": "string",
            "default": "#1e1e1e"
        },
        "metaGo.decoration.color": {
            "type": "string",
            "default": "black"
        },
        "metaGo.decoration.width": {
            "type": "number",
            "default": 9
        },
        "metaGo.decoration.height": {
            "type": "number",
            "default": 15
        },
        "metaGo.decoration.fontSize": {
            "type": "number",
            "default": 13
        },
        "metaGo.decoration.x": {
            "type": "number",
            "default": 1
        },
        "metaGo.decoration.y": {
            "type": "number",
            "default": 10
        },
        "metaGo.decoration.fontWeight": {
            "type": "string",
            "default": "normal"
        },
        "metaGo.decoration.fontFamily": {
            "type": "string",
            "default": "Consolas"
        },
        "metaGo.decoration.upperCase": {
            "type": "boolean",
            "default": false
        },
        "metaGo.finder.findAllMode": {
            "type": "string",
            "default": "on"
        },
        "metaGo.finder.wordSeparatorPattern": {
            "type": "string",
            "default": "[ ,-.{_(\"'<\\/[+]"
        },
        "metaGo.finder.range": {
            "type": "number",
            "default": 40
        }
    }

## Release Notes

Users appreciate release notes as you update your extension.

### 1.1.0

Added features.

### 1.0.1

Initial release

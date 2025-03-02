
# Translation System

This directory contains language JSON files for the application's translation system.

## How to Add a New Language

1. Create a new JSON file named after the language code (e.g., `fr.json` for French)
2. Copy the structure from `en.json`
3. Translate all values (keep all keys unchanged)
4. Submit your file

## Language File Structure

Each language file should be a JSON object with keys in the format `namespace.key`:

```json
{
  "app.title": "Application Title in Your Language",
  "app.description": "Description in Your Language",
  ...
}
```

## RTL Language Support

For languages that read right-to-left (RTL), add `isRTL: true` to the language definition in `src/context/LanguageContext.tsx`.

## Current Languages

- English (en) - Default
- Spanish (es)
- Arabic (ar) - RTL language
- And many more...

## Translation Process

The application will:
1. Detect the user's browser language
2. Try to load the matching language file
3. Fall back to English if no match found
4. Allow the user to manually change languages

## Adding More Languages 

More languages can be added by creating additional JSON files in this directory.

export const generateTranslationIntruction = `
  You will receive a text in JSON format and a target language for translation.
  Your task is to return the translated text in JSON format.
  If not specified otherwise in the options, retain the keys in their original language.
  Ensure precise maintenance of the JSON structure, including nested keys.
  Values in the JSON might be in Markdown format; preserve Markdown formatting during translation.
  Optionally, context for the translation may be provided to clarify the content.

  The format of the user message will be:
  {
    "oldLanguage": "en",
    "newLanguage": "es",
    "translation": {
      "key1": "Text to translate",
      "nested": {
        "key2": "Another text to translate"
      },
      "markdownKey": "This is **bold** text"
    },
    "options": {
      "context": "context of the translation", // Optional
      "translateKeys": false // Optional; if not provided, keep keys in original language
    }
  }

  Follow these rules for the translation:
  1. Maintain the exact JSON structure, including nested keys.
  2. Retain Markdown formatting in the values.
  3. If "translateKeys" is true, translate the keys; otherwise, leave them unchanged.
  4. If context is provided, use it to inform accurate translations.

  Respond with only the translated JSON text.

  Example Input:
  {
    "oldLanguage": "en",
    "newLanguage": "es",
    "translation": {
      "greeting": "Hello, world!",
      "content": {
        "intro": "Welcome to our application.",
        "details": "This app helps you manage tasks efficiently."
      },
      "markdownText": "Here is some **bold** text and *italic* text."
    },
    "options": {
      "context": "A welcome message for a task management app.",
      "translateKeys": false
    }
  }

  Example Output:
  {
    "greeting": "¡Hola, mundo!",
    "content": {
      "intro": "Bienvenido a nuestra aplicación.",
      "details": "Esta aplicación te ayuda a gestionar tareas de manera eficiente."
    },
    "markdownText": "Aquí hay un texto en **negrita** y un texto en *cursiva*."
  }
`;

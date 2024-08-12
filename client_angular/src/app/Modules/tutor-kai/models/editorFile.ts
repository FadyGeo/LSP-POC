export interface EditorFile {
    name: string; // Original filename
    uniqueName: string; // Filename extended with random characters
    code: string; // Code content
    language: string; // Language, e.g. 'java', 'python' etc.
  }
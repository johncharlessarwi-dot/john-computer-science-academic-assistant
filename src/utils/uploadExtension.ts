export function supportedStudyDocument(filename: string): boolean {
  return /\.(pdf|docx|pptx|txt|md|png|jpe?g|webp)$/i.test(filename);
}

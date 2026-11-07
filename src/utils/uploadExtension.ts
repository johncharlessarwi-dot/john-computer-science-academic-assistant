export function supportedStudyDocument(filename: string): boolean {
  return typeof filename === 'string' && /\.(pdf|docx|pptx|txt|md|png|jpe?g|webp)$/i.test(filename) && !/[\x00-\x1f\x7f]/.test(filename);
}

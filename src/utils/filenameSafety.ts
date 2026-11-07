export function safeAcademicFilename(filename: string): string {
  const cleaned = filename.replace(/[\\/\x00-\x1f\x7f]/g,'_').replace(/^\.+/,'').replace(/[.\s]+$/g,'').slice(0,120);
  return cleaned || 'unnamed-document';
}

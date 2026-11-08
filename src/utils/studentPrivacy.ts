export function redactStudentEmail(text: string): string {
  if(typeof text!=='string')return '';
  return text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}/gi,'[email redacted]');
}

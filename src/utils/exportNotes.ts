import jsPDF from 'jspdf';

export function downloadNotesAsPDF(title: string, courseCode: string, summaryText: string) {
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const maxLineWidth = pageWidth - margin * 2;
  let currentY = 24;

  // Header Banner Background
  pdf.setFillColor(30, 64, 175); // Blue-800
  pdf.rect(0, 0, pageWidth, 28, 'F');

  // Header Text
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('AI SUMMARIZED LECTURE NOTES', margin, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Doc: ${title}`, margin, 18);
  pdf.text(`Course: ${courseCode || 'CS Module'} | Date: ${new Date().toLocaleDateString()}`, margin, 23);

  currentY = 36;

  // Check page break helper
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 16) {
      pdf.addPage();
      currentY = 20;
    }
  };

  const lines = summaryText.split('\n');

  for (let rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      currentY += 3;
      continue;
    }

    if (line.startsWith('# ')) {
      checkPageBreak(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.setTextColor(30, 64, 175); // Primary Blue
      const text = line.replace(/^#\s+/, '');
      pdf.text(text, margin, currentY);
      currentY += 2;
      pdf.setLineWidth(0.4);
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;
    } else if (line.startsWith('## ')) {
      checkPageBreak(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42); // Slate 900
      const text = line.replace(/^##\s+/, '');
      pdf.text(text, margin, currentY);
      currentY += 6;
    } else if (line.startsWith('### ')) {
      checkPageBreak(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(51, 65, 85); // Slate 700
      const text = line.replace(/^###\s+/, '');
      pdf.text(text, margin, currentY);
      currentY += 5;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(51, 65, 85);
      const text = line.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1');
      const wrapped = pdf.splitTextToSize(`• ${text}`, maxLineWidth - 4);
      checkPageBreak(wrapped.length * 4.5);
      pdf.text(wrapped, margin + 4, currentY);
      currentY += wrapped.length * 4.5 + 1;
    } else if (/^\d+\.\s+/.test(line)) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(51, 65, 85);
      const text = line.replace(/\*\*(.*?)\*\*/g, '$1');
      const wrapped = pdf.splitTextToSize(text, maxLineWidth - 4);
      checkPageBreak(wrapped.length * 4.5);
      pdf.text(wrapped, margin + 4, currentY);
      currentY += wrapped.length * 4.5 + 1;
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(51, 65, 85);
      const text = line.replace(/\*\*(.*?)\*\*/g, '$1');
      const wrapped = pdf.splitTextToSize(text, maxLineWidth);
      checkPageBreak(wrapped.length * 4.5);
      pdf.text(wrapped, margin, currentY);
      currentY += wrapped.length * 4.5 + 1.5;
    }
  }

  // Footer page numbers
  const totalPages = (pdf.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // Slate 400
    pdf.text(
      `Computer Science AI Notes — Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 8
    );
  }

  const cleanName = title.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`${cleanName}_Summary.pdf`);
}

export function downloadNotesAsMarkdown(title: string, courseCode: string, summaryText: string) {
  const header = `---
title: ${title} - AI Summarized Lecture Notes
course: ${courseCode || 'General'}
date: ${new Date().toLocaleDateString()}
generator: Computer Science AI Study Suite
---

`;
  const fullContent = header + summaryText;
  const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanName = title.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('download', `${cleanName}_Summary.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

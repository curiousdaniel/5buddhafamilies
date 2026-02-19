import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportToPng(element: HTMLElement, filename = 'buddha-family-results.png') {
  const canvas = await html2canvas(element, {
    backgroundColor: '#1A1612',
    scale: 2,
    useCORS: true,
  })
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function exportToPdf(element: HTMLElement, filename = 'buddha-family-results.pdf') {
  const canvas = await html2canvas(element, {
    backgroundColor: '#1A1612',
    scale: 2,
    useCORS: true,
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [element.offsetWidth, element.offsetHeight],
  })
  pdf.addImage(imgData, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight)
  pdf.save(filename)
}

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportToBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#1A1612',
    scale: 2,
    useCORS: true,
  })
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png')
  })
}

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
    scale: 1.5,
    useCORS: true,
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: true,
  })

  const margin = 20
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2
  const scale = contentWidth / canvas.width
  const scaledHeight = canvas.height * scale
  const pageCount = Math.ceil(scaledHeight / contentHeight)

  for (let i = 0; i < pageCount; i++) {
    if (i > 0) pdf.addPage()

    const srcY = i * (contentHeight / scale)
    const srcHeight = Math.min(contentHeight / scale, canvas.height - srcY)

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = srcHeight
    const ctx = pageCanvas.getContext('2d')!
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, 0, canvas.width, srcHeight)

    const imgData = pageCanvas.toDataURL('image/jpeg', 0.88)
    const drawHeight = Math.min(contentHeight, scaledHeight - i * contentHeight)
    pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, drawHeight, undefined, 'FAST')
  }

  pdf.save(filename)
}

import type { RequestHandler } from 'express'
import PDFDocument from 'pdfkit'

export const createReport: RequestHandler = (request, response, next) => {
  const payload = request.body as { filename?: unknown; createdAt?: unknown; result?: unknown }
  if (typeof payload.filename !== 'string' || typeof payload.createdAt !== 'string' ||
      !payload.result || typeof payload.result !== 'object') {
    response.status(400).json({ error: 'A scan result is required to create a report.' })
    return
  }
  const result = payload.result as Record<string, unknown>
  if (typeof result.description !== 'string' || typeof result.category !== 'string') {
    response.status(400).json({ error: 'The scan result is incomplete.' })
    return
  }

  try {
    const pdf = new PDFDocument({ margin: 52, size: 'A4', info: { Title: 'VisioLab image report' } })
    const safeName = payload.filename.replace(/[\r\n"]/g, '').slice(0, 120)
    response.setHeader('Content-Type', 'application/pdf')
    response.setHeader('Content-Disposition', 'attachment; filename="image-report.pdf"')
    pdf.on('error', next)
    pdf.pipe(response)
    pdf.fontSize(22).fillColor('#20243a').text('VisioLab image report')
    pdf.moveDown(0.35).fontSize(10).fillColor('#68708a').text(`${safeName}  ·  ${payload.createdAt}`)
    pdf.moveDown().fontSize(12).fillColor('#20243a').text('Overview', { continued: false })
    pdf.moveDown(0.3).fontSize(10).fillColor('#34384a').text(result.description)
    const sections: [string, unknown][] = [
      ['Category', result.category],
      ['Objects detected', result.objects],
      ['Extracted text', result.extractedText],
      ['Document type', result.documentType],
      ['Products', result.products],
      ['Scene', result.scene],
      ['Background', result.background],
      ['Color palette', result.colors],
      ['Image quality', result.quality],
    ]
    for (const [title, value] of sections) {
      if (value === undefined || value === null || value === '') continue
      pdf.moveDown(0.8).fontSize(12).fillColor('#20243a').text(title)
      const content = Array.isArray(value) || typeof value === 'object'
        ? JSON.stringify(value, null, 2)
        : String(value)
      pdf.moveDown(0.25).fontSize(10).fillColor('#34384a').text(content, { lineGap: 2 })
    }
    pdf.end()
  } catch (error) {
    next(error)
  }
}

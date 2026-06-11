import AppKit
import Foundation
import PDFKit

if CommandLine.arguments.count < 4 {
    fputs("Usage: swift render_pdf_pages.swift <pdf> <output-dir> <page> [page...]\n", stderr)
    exit(2)
}

let pdfPath = CommandLine.arguments[1]
let outputDir = CommandLine.arguments[2]
let pages = CommandLine.arguments.dropFirst(3).compactMap { Int($0) }

let pdfURL = URL(fileURLWithPath: pdfPath)
guard let document = PDFDocument(url: pdfURL) else {
    fputs("Could not open PDF: \(pdfPath)\n", stderr)
    exit(1)
}

try FileManager.default.createDirectory(
    at: URL(fileURLWithPath: outputDir),
    withIntermediateDirectories: true
)

for pageNumber in pages {
    guard pageNumber >= 1, pageNumber <= document.pageCount,
          let page = document.page(at: pageNumber - 1) else {
        fputs("Skipping invalid page \(pageNumber)\n", stderr)
        continue
    }

    let bounds = page.bounds(for: .mediaBox)
    let scale: CGFloat = 2.0
    let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
    let image = page.thumbnail(of: size, for: .mediaBox)

    guard let tiff = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let data = bitmap.representation(using: .png, properties: [:]) else {
        fputs("Could not render page \(pageNumber)\n", stderr)
        continue
    }

    let outURL = URL(fileURLWithPath: outputDir)
        .appendingPathComponent(String(format: "page-%03d.png", pageNumber))
    try data.write(to: outURL)
    print(outURL.path)
}

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type InvoiceItem = {
  title: string;
  quantity: number;
  unitPrice: number;
  condition?: string;
  sellerName?: string;
  imageUrl?: string | null;
};

export type BuildInvoiceOpts = {
  invoiceNumber: string;
  buyerName: string;
  buyerEmail?: string;
  items: Array<InvoiceItem>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  date: Date;

  // Branding (optional)
  logoUrl?: string;   // e.g. "/logo.png" or hosted URL
  brandName?: string; // defaults to "TradeSpace"
};

async function fetchBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: Array<string> = [];
  let line = "";

  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function money(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return `$${v.toFixed(2)}`;
}

export async function buildInvoicePdf(opts: BuildInvoiceOpts): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  let y = height - margin;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size = 11,
    isBold = false,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, { x, y: yPos, size, font: isBold ? bold : font, color });
  };

  // ===== Header (logo + title)
  const headerH = 60;

  // header bar
  page.drawRectangle({
    x: margin,
    y: y - headerH + 10,
    width: width - margin * 2,
    height: headerH,
    color: rgb(0.97, 0.97, 0.98),
    borderColor: rgb(0.9, 0.9, 0.92),
    borderWidth: 1,
  });

  // Logo (optional)
  if (opts.logoUrl) {
    try {
      const logoBytes = await fetchBytes(opts.logoUrl);
      let logoImg;
      try {
        logoImg = await pdfDoc.embedPng(logoBytes);
      } catch {
        logoImg = await pdfDoc.embedJpg(logoBytes);
      }

      const logoH = 34;
      const scale = logoH / logoImg.height;
      const logoW = logoImg.width * scale;

      page.drawImage(logoImg, {
        x: margin + 14,
        y: y - 34,
        width: logoW,
        height: logoH,
      });
    } catch (e) {
      console.warn("Logo embed failed (likely CORS or missing file):", e);
    }
  }

  const brand = opts.brandName ?? "TradeSpace";
  drawText(brand, margin + 150, y - 22, 18, true);
  drawText("Invoice", margin + 150, y - 44, 12, false, rgb(0.35, 0.35, 0.38));

  // Right-side meta
  drawText(`Invoice: ${opts.invoiceNumber}`, width - margin - 220, y - 24, 11, true);
  drawText(
    `Date: ${opts.date.toLocaleString()}`,
    width - margin - 220,
    y - 40,
    10,
    false,
    rgb(0.35, 0.35, 0.38)
  );

  y -= headerH + 16;

  // ===== Buyer block
  page.drawRectangle({
    x: margin,
    y: y - 60,
    width: width - margin * 2,
    height: 60,
    borderColor: rgb(0.9, 0.9, 0.92),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  drawText("Billed To", margin + 12, y - 18, 11, true);
  drawText(opts.buyerName, margin + 12, y - 36, 11, false);
  if (opts.buyerEmail) {
    drawText(opts.buyerEmail, margin + 12, y - 52, 10, false, rgb(0.35, 0.35, 0.38));
  }

  y -= 80;

  // ===== Items header
  drawText("Items", margin, y, 13, true);
  y -= 14;

  // Column layout
  const thumbSize = 44;
  const colX = {
    thumb: margin,
    title: margin + thumbSize + 12,
    qty: width - margin - 190,
    unit: width - margin - 130,
    total: width - margin - 60,
  };

  // Table header row
  page.drawRectangle({
    x: margin,
    y: y - 22,
    width: width - margin * 2,
    height: 22,
    color: rgb(0.97, 0.97, 0.98),
    borderColor: rgb(0.9, 0.9, 0.92),
    borderWidth: 1,
  });

  drawText("Product", colX.title, y - 16, 10, true);
  drawText("Qty", colX.qty, y - 16, 10, true);
  drawText("Unit", colX.unit, y - 16, 10, true);
  drawText("Line", colX.total, y - 16, 10, true);

  y -= 32;

  // ===== Items rows (with thumbnails)
  for (const it of opts.items) {
    const qty = Math.max(1, Number(it.quantity) || 1);
    const unit = Number(it.unitPrice) || 0;
    const lineTotal = unit * qty;

    const rowH = 64;

    // page-break (single-page mode)
    if (y - rowH < margin + 150) {
      throw new Error("Invoice too long for 1 page. Ask me for multi-page support.");
    }

    // row background
    page.drawRectangle({
      x: margin,
      y: y - rowH,
      width: width - margin * 2,
      height: rowH,
      borderColor: rgb(0.92, 0.92, 0.94),
      borderWidth: 1,
      color: rgb(1, 1, 1),
    });

    // Thumbnail placeholder
    page.drawRectangle({
      x: colX.thumb + 8,
      y: y - rowH + 10,
      width: thumbSize,
      height: thumbSize,
      borderColor: rgb(0.9, 0.9, 0.92),
      borderWidth: 1,
      color: rgb(0.98, 0.98, 0.99),
    });

    // Embed image (optional)
    if (it.imageUrl) {
      try {
        const imgBytes = await fetchBytes(it.imageUrl);
        let img;
        try {
          img = await pdfDoc.embedPng(imgBytes);
        } catch {
          img = await pdfDoc.embedJpg(imgBytes);
        }

        const scale = Math.min(thumbSize / img.width, thumbSize / img.height);
        const w = img.width * scale;
        const h = img.height * scale;

        const x = colX.thumb + 8 + (thumbSize - w) / 2;
        const yImg = y - rowH + 10 + (thumbSize - h) / 2;

        page.drawImage(img, { x, y: yImg, width: w, height: h });
      } catch (e) {
        console.warn("Item image embed failed (likely CORS):", e);
      }
    }

    // Title (wrap max 2 lines)
    const titleLines = wrapText(it.title, 34).slice(0, 2);
    const titleY1 = y - 20;
    const titleY2 = y - 34;

    drawText(titleLines[0] ?? "", colX.title, titleY1, 11, true);
    if (titleLines[1]) {
      drawText(titleLines[1], colX.title, titleY2, 11, true);
    }

    // Meta line (push down if we used a second title line)
    const metaY = titleLines[1] ? y - 50 : y - 38;

    const meta = [
      it.condition ? `Condition: ${it.condition}` : null,
      it.sellerName ? `Seller: ${it.sellerName}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    if (meta) drawText(meta, colX.title, metaY, 9, false, rgb(0.35, 0.35, 0.38));

    // Numbers
    drawText(String(qty), colX.qty, y - 28, 11);
    drawText(money(unit), colX.unit, y - 28, 11);
    drawText(money(lineTotal), colX.total, y - 28, 11, true);

    y -= rowH + 10;
  }

  // ===== Totals box
  const boxW = 260;
  const boxH = 120;

  page.drawRectangle({
    x: width - margin - boxW,
    y: y - boxH,
    width: boxW,
    height: boxH,
    borderColor: rgb(0.9, 0.9, 0.92),
    borderWidth: 1,
    color: rgb(0.98, 0.98, 0.99),
  });

  const tx = width - margin - boxW + 14;
  let ty = y - 24;

  const totalsLine = (label: string, value: string, boldLine = false) => {
    drawText(label, tx, ty, 10, false, rgb(0.35, 0.35, 0.38));
    drawText(value, tx + 150, ty, 10, boldLine);
    ty -= 18;
  };

  totalsLine("Subtotal", money(opts.subtotal));
  totalsLine("Shipping", money(opts.shipping));
  totalsLine("Tax", money(opts.tax));

  page.drawLine({
    start: { x: tx, y: ty + 6 },
    end: { x: tx + boxW - 28, y: ty + 6 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.92),
  });

  ty -= 10;
  totalsLine("TOTAL", money(opts.total), true);

  // Footer
  drawText(
    "Thank you for your purchase!",
    margin,
    margin - 6,
    10,
    true,
    rgb(0.35, 0.35, 0.38)
  );

  return await pdfDoc.save(); // Uint8Array
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  // Force a real (non-shared) ArrayBuffer by copying into a new Uint8Array
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);

  const ab: ArrayBuffer = copy.buffer;

  const blob = new Blob([ab], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}



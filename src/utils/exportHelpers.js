import html2canvas from 'html2canvas-pro';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Dark mode'u geçici olarak kaldırıp export sonrası geri yükler.
// PrintableAnalysis/PrintableComparison zaten white background kullanıyor
// ama diğer yerlerden çağrılırsa güvenlik için bırakıyoruz.
async function withLightMode(fn) {
  const root = document.documentElement;
  const wasDark = root.classList.contains('dark');
  if (wasDark) root.classList.remove('dark');
  try {
    return await fn();
  } finally {
    if (wasDark) root.classList.add('dark');
  }
}

// Ekran dışı (left: -9999px) konumlandırılmış bir elementi yakalar.
// Hedef element inline-style ile 1200px genişlik tanımladığından
// mobil/desktop farkı yoktur.
async function captureElement(element) {
  // Element'in tam boyutlarının browser tarafından hesaplanması için kısa bekleme
  await new Promise(resolve => setTimeout(resolve, 150));

  return html2canvas(element, {
    scale:           2,
    useCORS:         true,
    allowTaint:      true,
    backgroundColor: '#ffffff',
    logging:         false,
    scrollX:         0,
    scrollY:         0,
  });
}

export async function exportToPNG(ref, filename = `HMGS-Analiz-${todayStr()}.png`) {
  return withLightMode(async () => {
    const canvas = await captureElement(ref.current);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

export async function exportToPDF(ref, filename = `HMGS-Analiz-${todayStr()}.pdf`) {
  return withLightMode(async () => {
    const canvas = await captureElement(ref.current);

    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW  = pdf.internal.pageSize.getWidth();
    const pageH  = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const imgW   = pageW - margin * 2;
    const imgH   = (canvas.height * imgW) / canvas.width;

    const imgData = canvas.toDataURL('image/png');
    let remaining = imgH;
    let yOffset   = 0;

    while (remaining > 0) {
      pdf.addImage(imgData, 'PNG', margin, margin - yOffset, imgW, imgH);
      remaining -= pageH - margin * 2;
      yOffset   += pageH - margin * 2;
      if (remaining > 0) pdf.addPage();
    }

    pdf.save(filename);
  });
}

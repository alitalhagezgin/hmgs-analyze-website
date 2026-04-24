import html2canvas from 'html2canvas-pro';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Dark mode'u geçici olarak kaldırıp, export sonrası geri yükler
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

// Mobilde desktop genişliğini simüle ederek canvas alır
async function captureElement(element) {
  const isMobile = window.innerWidth < 1024;

  const originalStyles = {
    width:    element.style.width,
    minWidth: element.style.minWidth,
    maxWidth: element.style.maxWidth,
  };

  if (isMobile) {
    element.style.width    = '1280px';
    element.style.minWidth = '1280px';
    element.style.maxWidth = '1280px';
    // Recharts ResponsiveContainer'ın yeni boyutu algılayıp yeniden render etmesi için bekle
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    // Grafiklerin render tamamlanması için kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  try {
    return await html2canvas(element, {
      scale:         2,
      useCORS:       true,
      allowTaint:    true,
      backgroundColor: '#f8fafc',
      logging:       false,
      windowWidth:   isMobile ? 1280 : element.scrollWidth,
      windowHeight:  element.scrollHeight,
      width:         isMobile ? 1280 : element.scrollWidth,
      height:        element.scrollHeight,
      scrollX:       0,
      scrollY:       0,
    });
  } finally {
    element.style.width    = originalStyles.width;
    element.style.minWidth = originalStyles.minWidth;
    element.style.maxWidth = originalStyles.maxWidth;
  }
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

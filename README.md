# HMGS Web

HMGS Web, Hukuk Mesleklerine Gecis Sinavi (HMGS) soru performansini hizli sekilde isaretlemek, konu bazli analiz etmek ve gelisim takibi yapmak icin hazirlanmis bir React + Vite uygulamasidir.

## Ozellikler

- 120 soruluk deneme takibi
- 6 farkli soru durumu isaretleme (dogru, yanlis, dogruya yakin, yanlisa yakin, hatirlamiyorum, bos)
- Klavye kisayollari ile hizli isaretleme
- Konu bazli toplu atama
- Karanlik/aydinlik tema destegi
- Analiz ve istatistik ekranlari
- PDF / goruntu disa aktarma altyapisi

## Teknolojiler

- React 19
- Vite 8
- Tailwind CSS 4
- Recharts
- Lucide React
- jsPDF + html2canvas

## Kurulum

Asagidaki adimlari proje klasorunde calistirin:

```bash
npm install
npm run dev
```

Uygulama varsayilan olarak Vite gelistirme sunucusunda acilir.

## Build ve Onizleme

```bash
npm run build
npm run preview
```

## Klavye Kisayollari

- 1: Dogru
- 2: Yanlis
- 3: Dogruya yakin
- 4: Yanlisa yakin
- 5: Hatirlamiyorum
- 6: Bos biraktim
- Yukari / Asagi ok: Sorular arasinda gecis

## Proje Yapisi

```text
src/
  components/   # UI bilesenleri
  data/         # Konu ve sabit veriler
  hooks/        # Durum ve tema yonetimi
  utils/        # Analiz ve export yardimcilari
```

## Lisans

Bu proje ISC lisansi ile dagitilmaktadir.

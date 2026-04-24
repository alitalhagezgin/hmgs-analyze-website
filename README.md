# HMGS Web

HMGS Web, Hukuk Mesleklerine Gecis Sinavi (HMGS) icin 120 soruluk deneme isaretleme, konu bazli analiz, sinav kaydetme ve sinav karsilastirma odakli bir React + Vite uygulamasidir.

## Ozellikler

- 120 soruluk sinav akisi
- 6 farkli soru durumu:
  - dogru
  - yanlis
  - dogruya yakin
  - yanlisa yakin
  - hatirlamiyorum
  - bos
- Klavye kisayollari ile hizli isaretleme (`1-6`, `ArrowUp`, `ArrowDown`)
- Otomatik kaydirma (soru isaretledikce bir sonraki soruya gecis)
- Tekil soru bazli konu secimi ve aralik bazli toplu konu atama
- Tum sorular isaretlenmeden analiz ekranina gecmeyi engelleyen kontrol
- Genel analiz ve konu bazli dagilimlar
- Tahmini puan ve minimum puan hesaplama
- Analiz ekranini PNG/PDF olarak disa aktarma
- Gecmis sinavlari kaydetme, yeniden adlandirma ve silme
- Kaydedilen sinavin detay goruntusu ve aktif sinav olarak geri yukleme
- 2-5 sinavi metrik bazli karsilastirma ve karsilastirma ekranini PNG/PDF indirme
- Acik/koyu tema destegi
- localStorage ile kalicilik:
  - aktif sinav durumu
  - kaydedilmis sinavlar

## Teknolojiler

- React 19
- Vite 8
- Tailwind CSS 4
- Recharts
- Lucide React
- html2canvas-pro
- jsPDF

## Kurulum

Proje klasorunde:

```bash
npm install
npm run dev
```

Varsayilan olarak Vite gelistirme sunucusu acilir.

## Scriptler

```bash
npm run dev      # gelistirme sunucusu
npm run build    # production build
npm run preview  # build ciktisini yerelde onizleme
```

## Kullanilan Durumlar ve Kisayollar

- `1`: dogru
- `2`: yanlis
- `3`: dogruya yakin
- `4`: yanlisa yakin
- `5`: hatirlamiyorum
- `6`: bos
- `ArrowDown`: bir sonraki soru
- `ArrowUp`: bir onceki soru

## Puanlama Ozet

- Temel puanlama: `(dogru / 120) * 100`
- Yanlislar dogruyu goturmez
- Tahmini puanda kararsiz durumlar olasilikla agirliklandirilir:
  - dogruya yakin: %70 dogru kabul
  - yanlisa yakin: %30 dogru kabul

## Proje Yapisi

```text
src/
  components/   # ekranlar ve UI bilesenleri
  data/         # konu listeleri ve sabitler
  hooks/        # tema/sinav/saklama durum yonetimi
  utils/        # analiz ve export yardimcilari
```

## Lisans

Bu proje ISC lisansi ile dagitilmaktadir.

# Internationalization (i18n) Implementation

Bu proje next-intl kütüphanesi kullanılarak çok dilli destek ile geliştirilmiştir. URL'de `/tr` veya `/en` prefix'i olmadan çalışır.

## Özellikler

- ✅ URL'de dil prefix'i yok (temiz URL'ler)
- ✅ Türkçe ve İngilizce dil desteği
- ✅ Tarayıcı diline göre otomatik algılama
- ✅ localStorage ile dil tercihi kaydetme
- ✅ Cookie ile server-side dil algılama
- ✅ Dil değiştirici komponenti

## Dosya Yapısı

```
src/
├── i18n/
│   ├── request.ts        # i18n konfigürasyonu
│   └── locales/
│       ├── en.json       # İngilizce çeviriler
│       └── tr.json       # Türkçe çeviriler
├── components/
│   └── LanguageSwitcher.tsx  # Dil değiştirici
├── hooks/
│   └── useLocale.ts      # Dil yönetimi hook'u
└── app/
    ├── _providers/
    │   └── LocaleProvider.tsx  # Locale provider
    ├── layout.tsx        # Ana layout
    └── page.tsx          # Ana sayfa
```

## Kullanım

### Dil Değiştirme

Kullanıcılar sağ üst köşedeki dil değiştirici butonunu kullanarak Türkçe ve İngilizce arasında geçiş yapabilirler.

### Çeviri Ekleme

Yeni çeviri eklemek için:

1. `src/i18n/locales/en.json` dosyasına İngilizce metni ekleyin
2. `src/i18n/locales/tr.json` dosyasına Türkçe çevirisini ekleyin
3. Komponentinizde `useTranslations` hook'unu kullanın

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return <h1>{t('key')}</h1>;
}
```

### Parametreli Çeviriler

```json
{
  "welcome": "Hoş geldiniz, {name}!"
}
```

```tsx
const t = useTranslations('common');
return <p>{t('welcome', { name: 'Ahmet' })}</p>;
```

## Teknik Detaylar

### Locale Algılama Sırası

1. Cookie'den (`NEXT_LOCALE`)
2. localStorage'dan (`preferred-locale`)
3. Tarayıcı dil ayarlarından
4. Varsayılan olarak İngilizce

### Middleware

`middleware.ts` dosyası tüm istekleri yakalar ve uygun locale'i belirler.

### Provider Yapısı

```tsx
<NextIntlClientProvider messages={messages}>
  <LocaleProvider>
    <ReduxProvider>
      <CartSyncProvider>
        {children}
      </CartSyncProvider>
    </ReduxProvider>
  </LocaleProvider>
</NextIntlClientProvider>
```

## Geliştirme

Projeyi çalıştırmak için:

```bash
pnpm dev
```

Uygulama http://localhost:3001 adresinde çalışacaktır.

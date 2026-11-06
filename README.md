# elhini.ru

Сайт-визитка на Astro и TypeScript. После сборки — обычные HTML/CSS/SVG, без клиентского рендера и серверной логики.

## Разработка

Node.js 24 и npm:

```sh
npm ci
npm run dev
```

## Сборка

```sh
npm run check
npm run build
npm test
```

Тексты — `src/content/profile.json`, вёрстка — `src/components/Page.astro`, стили — `src/styles/global.css`.

## Размещение

Публикуется только статика из `dist/`.

- **Hoster.ru:** загрузить содержимое `dist/` в корневой каталог домена. До замены сохранить прежние файлы вне web-каталога.
- **GitHub Pages:** опубликовать `dist/` через Pages Actions. Для своего домена оставить `/` и настроить домен в Pages/DNS.

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

Push в `main` запускает проверки, сборку и автодеплой через GitHub Actions. Можно запустить workflow вручную. Pull request запускает только проверки.

Деплой использует секреты окружения `production`: `HOSTER_HOST`, `HOSTER_USER`, `HOSTER_SSH_KEY`, `HOSTER_KNOWN_HOSTS`. На сервере установлен `scripts/hoster_receiver.py` с принудительной командой в `authorized_keys`: ключ принимает только файлы визитки и команду отката. После загрузки проверяются SHA-256 по HTTPS; при ошибке возвращается предыдущая версия. Один снимок для отката хранится вне web-каталога; соседние проекты и ACME-файлы сохраняются.

Проверка скриптов деплоя: `python3 -m unittest discover -s tests -p '*_test.py'`.

Изменение `.htaccess` требует обновления разрешённого SHA-256 и установленного receiver: ключ деплоя не может добавлять произвольные обработчики Apache.

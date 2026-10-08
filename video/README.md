# Видео на Remotion

Отдельный проект для создания видео в коде на React с помощью [Remotion](https://www.remotion.dev/docs/).
Он не зависит от Express-сервера в корне репозитория.

## Команды

```bash
cd video
npm install          # установить зависимости
npm run dev          # Remotion Studio: просмотр и редактирование (http://localhost:3000)
npm run render       # отрендерить HelloWorld в out/hello.mp4
npm run still        # сохранить один кадр в out/hello.png
npm run render:slideshow  # слайдшоу из картинок в out/slideshow.mp4
npm run typecheck    # проверка TypeScript
```

Отрендерить другую композицию или передать свои props:

```bash
npx remotion render HelloWorld out/custom.mp4 --props='{"title":"Привет","subtitle":"Тест","color":"#e11d48"}'
```

## Структура

- `src/index.ts` — точка входа (`registerRoot`)
- `src/Root.tsx` — список композиций: id, размер, fps, длительность, props по умолчанию
- `src/HelloWorld.tsx` — пример сцены с анимацией (`spring`, `interpolate`)
- `src/Slideshow.tsx` — слайдшоу из картинок с плавными переходами и лёгким зумом
- `scripts/image.mjs` — скачивание и редактирование картинок (sharp)
- `public/` — картинки, аудио и шрифты; подключаются через `staticFile("имя")`
- `remotion.config.ts` — настройки CLI

## Картинки

Картинки лежат в `public/images/`, а в коде подключаются через `<Img src={staticFile("images/имя.jpg")} />`.

```bash
npm run image -- fetch <url> photo.jpg                      # скачать в public/images
npm run image -- info photo.jpg                             # размер и формат
npm run image -- edit photo.jpg photo-hd.jpg --resize 1920x1080 --saturation 1.2
```

Остальные опции (`--crop`, `--rotate`, `--grayscale`, `--blur`, `--fit contain` и т. д.) описаны в начале `scripts/image.mjs`.

Слайдшоу из своих картинок:

```bash
npx remotion render Slideshow out/my.mp4 --props='{"images":["images/a.jpg","images/b.jpg"],"secondsPerImage":3,"transitionSeconds":0.5}'
```

В облачной сессии Claude Code картинку можно скачать только с сайта, который разрешён в сетевых настройках окружения.

## Скиллы для Claude

В `.claude/skills/` лежат официальные скиллы Remotion (`remotion-best-practices` и другие)
и скилл `video-images`: поиск, скачивание, редактирование картинок и добавление их в видео.

## Браузер для рендера

Для рендера Remotion нужен Chrome Headless Shell. Конфиг ищет его в таком порядке:

1. путь из переменной окружения `REMOTION_BROWSER_EXECUTABLE`;
2. headless shell от Playwright из `PLAYWRIGHT_BROWSERS_PATH` (уже установлен в облачных сессиях Claude Code);
3. если ничего не найдено, Remotion сам скачивает браузер с `remotion.media` при первом рендере.

FFmpeg отдельно ставить не нужно: он входит в пакет `@remotion/renderer`.

## Лицензия

Компаниям от 4 сотрудников нужна платная лицензия Remotion: https://www.remotion.dev/license

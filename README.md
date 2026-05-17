# Cowork App — реестры сделок

Веб-интерфейс на Next.js поверх твоего Supabase (`stwsaddhjvhqeewmwstp`).

- Magic-link логин (без паролей)
- Дашборд по этапам воронки
- Все сделки, фильтр по этапу, поиск по описанию
- Карточка сделки: редактирование 21 поля + смена этапа + история переходов
- Отдельный реестр на каждый из 15 этапов (тянет из `v_registry_*` views)
- Append-only поведение: запись остаётся во всех пройденных реестрах

## Стек

Next.js 14 (App Router) · TypeScript · Tailwind · `@supabase/ssr`

## Деплой за 5 шагов (без терминала)

### 1. Создай новый репозиторий на GitHub
- https://github.com/new
- Имя: `cw-app` (любое)
- Private (если хочешь скрыть код)
- НЕ ставь галочку "Initialize this repository with..."
- Создай.

### 2. Залей файлы в репозиторий
- На странице репо жми **"uploading an existing file"** (синяя ссылка).
- Перетащи в окно браузера **ВСЁ содержимое папки `cw-app/`** (но НЕ саму папку — её содержимое, чтобы `package.json` оказался в корне репо).
- Внизу страницы: **Commit changes** → **Commit**.

### 3. Подключи репозиторий к Vercel
- https://vercel.com/new
- Если первый раз — Vercel попросит авторизовать GitHub. Разреши, выбрав только этот репо или все.
- Найди `cw-app` в списке → **Import**.

### 4. Пропиши env-переменные
На экране настроек проекта Vercel в секции **Environment Variables** добавь две:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://stwsaddhjvhqeewmwstp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_p3vndyCd8zARFk9dD7txFA_jd1cDV-8` |

Жми **Deploy**.

### 5. Пропиши Vercel-домен в Supabase Auth
Когда Vercel дойдёт до зелёного "Ready" — скопируй URL твоего деплоя (что-то вроде `https://cw-app-xxxx.vercel.app`).

В Supabase:
- https://supabase.com/dashboard/project/stwsaddhjvhqeewmwstp/auth/url-configuration
- В **Site URL** вставь `https://cw-app-xxxx.vercel.app`
- В **Redirect URLs** добавь `https://cw-app-xxxx.vercel.app/auth/callback`
- Save.

Если этого не сделать — magic-link будет редиректить на localhost и не залогинит.

### Готово
Открой `https://cw-app-xxxx.vercel.app/login`, введи свою почту, открой письмо, кликни ссылку — ты в системе.

## Локальная разработка (опц.)

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Откроется на http://localhost:3000.

## Что внутри

```
src/
├── app/
│   ├── (app)/              ← защищённые страницы
│   │   ├── layout.tsx       ← сайдбар + проверка auth
│   │   ├── dashboard/       ← цифры по этапам
│   │   ├── deals/           ← список + детали + создание
│   │   └── registry/[stage] ← реестр по каждому этапу
│   ├── login/               ← magic-link форма
│   └── auth/callback/       ← OAuth callback из Supabase
├── lib/
│   ├── supabase-server.ts   ← server-side клиент
│   ├── supabase-client.ts   ← browser-side клиент
│   └── stages.ts            ← русские лейблы этапов/статусов
└── middleware.ts            ← guard: неавторизованных → /login
```

## Что НЕ вошло (фоллоу-ап)

- Тонкие роли (ПМ видит свои поля, юрист свои) — задача #6 в плане
- Кастомные формы под каждый этап
- Управление контрагентами/сотрудниками (сейчас только чтение)
- amoCRM webhook → авто-создание сделок (задача #5)
- Миграция 648 строк из старой Excel (задача #4)

## Если что-то сломалось

- **Не приходит magic link** → проверь Site URL и Redirect URLs в Supabase Auth, проверь спам.
- **"Failed to fetch" на странице** → проверь, что обе env-переменные в Vercel прописаны и деплой свежий.
- **Пустые таблицы** → данных ещё нет, либо RLS политика блокирует. Залогинься, проверь через `/dashboard`.

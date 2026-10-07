import { jsxRenderer } from 'hono/jsx-renderer'

const SITE_NAME = 'abby GROUP'
const DEFAULT_TITLE = 'abby GROUP｜価値をつなぎ、可能性をひらく。'
const DEFAULT_DESC =
  'abby GROUPは、リユース・オークション・人材という事業を通じて、まだ眠っている価値を見つけ、次の未来へつないでいく企業グループです。'

type Props = {
  title?: string
  description?: string
  path?: string
}

export const renderer = jsxRenderer(({ children, title, description, path }: Props & { children?: any }) => {
  const t = title ?? DEFAULT_TITLE
  const d = description ?? DEFAULT_DESC
  const url = `https://abbygroup-inc.com${path ?? '/'}`

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t}</title>
        <meta name="description" content={d} />
        <meta name="format-detection" content="telephone=no" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={t} />
        <meta property="og:description" content={d} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Noto+Sans+JP:wght@400;500;600;700&family=Poppins:wght@300;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        <div class="pt-overlay" id="pt-overlay" aria-hidden="true"></div>
        <div id="page">{children}</div>
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})

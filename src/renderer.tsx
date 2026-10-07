import { jsxRenderer } from 'hono/jsx-renderer'

const SITE_NAME = 'abby GROUP'
const SITE_URL = 'https://abbygroup-inc.com'
const OGP_IMAGE = `${SITE_URL}/static/ogp.png`
const DEFAULT_TITLE = 'abby GROUP｜価値をつなぎ、可能性をひらく。'
const DEFAULT_DESC =
  'abby GROUPは、リユース・オークション・人材という事業を通じて、まだ眠っている価値を見つけ、次の未来へつないでいくグループです。'

/*
 * Cloudflare Web Analytics の beacon トークン。
 * 値を設定すると計測タグが出力されます（空文字の間は出力されません）。
 */
const CF_ANALYTICS_TOKEN = ''

/* サイト全体の構造化データ（グループブランドとして記述・法人格は主張しない） */
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'abbyグループ',
      url: `${SITE_URL}/`,
      logo: OGP_IMAGE,
      image: OGP_IMAGE,
      description: DEFAULT_DESC,
      sameAs: ['https://abby-inc.com/', 'https://abby-auction.com/', 'https://abby-hr.com/'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: 'ja',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
}

type Props = {
  title?: string
  description?: string
  path?: string
  noindex?: boolean
}

export const renderer = jsxRenderer(({ children, title, description, path, noindex }: Props & { children?: any }) => {
  const t = title ?? DEFAULT_TITLE
  const d = description ?? DEFAULT_DESC
  const canonical = `${SITE_URL}${path && path !== '/' ? path : '/'}`

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t}</title>
        <meta name="description" content={d} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#101010" />
        <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:title" content={t} />
        <meta property="og:description" content={d} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={OGP_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="abby GROUP 価値をつなぎ、可能性をひらく。" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t} />
        <meta name="twitter:description" content={d} />
        <meta name="twitter:image" content={OGP_IMAGE} />

        <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/static/ogp.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Noto+Sans+JP:wght@400;500;600;700&family=Poppins:wght@300;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="/static/style.css" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
      </head>
      <body>
        <div class="pt-overlay" id="pt-overlay" aria-hidden="true"></div>
        <div id="page">{children}</div>
        <script src="/static/app.js" defer></script>
        {CF_ANALYTICS_TOKEN ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_ANALYTICS_TOKEN })}
          ></script>
        ) : null}
      </body>
    </html>
  )
})

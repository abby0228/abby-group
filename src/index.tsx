import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

type Bindings = {
  DB?: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()
app.use(renderer)
app.use('/api/*', cors())

/* ------------------------------------------------------------------ *
 * データ
 * ------------------------------------------------------------------ */

type Company = {
  no: string
  category: string
  label: string
  name: string
  url: string
  external: boolean
  body: string[]
  lead: string
}

const COMPANIES: Company[] = [
  {
    no: '01',
    category: 'REUSE',
    label: 'リユース事業',
    name: '株式会社abby',
    url: 'https://abby-inc.com/',
    external: true,
    body: [
      'ブランド品・ジュエリー・時計を中心に、買取・販売・卸を展開するリユース事業。',
      'モノが持つ価値を見極め、次に必要とする人へつなぎます。',
    ],
    lead: 'モノの価値を見極め、\n次に必要とする人へ。',
  },
  {
    no: '02',
    category: 'AUCTION',
    label: 'オークション事業',
    name: '株式会社Abby auction',
    url: 'https://abby-auction.com/',
    external: true,
    body: [
      'ブランドジュエリー専門オークション「Abb auction byOKURA」を運営。',
      '売り手と買い手、商品と市場をつなぎ、新たな流通を生み出します。',
    ],
    lead: '価値を市場につなぎ、\n新たな流通を生み出す。',
  },
  {
    no: '03',
    category: 'HUMAN RESOURCES',
    label: '人材ソリューション事業',
    name: '株式会社Abby Solution',
    url: 'https://abby-hr.com/',
    external: true,
    body: [
      '営業支援で培ったノウハウを活かし、営業支援・人材派遣・人材紹介などの人材ソリューションを提供します。',
      '人の可能性と企業の成長をつなぎます。',
    ],
    lead: '人の可能性と、\n企業の成長をつなぐ。',
  },
]

type NewsItem = { date: string; category: string; title: string; url?: string }

/*
 * NEWS は CMS / D1 等に差し替え可能。
 * 配列が空の場合、NEWSセクションとナビの NEWS 項目は自動的に非表示になります。
 * 追加する場合は下記の形式で項目を入れてください。
 *   { date: '2026.10.07', category: 'GROUP', title: 'お知らせのタイトル', url: '/news/xxx' }
 * url は省略可。省略した場合はリンクなしの行として表示されます。
 *
 * 記載ポリシー: 事実のみを記載します（推測・生成した実績や数値は記載しません）。
 */
const NEWS: NewsItem[] = [
  {
    date: '2026.10.07',
    category: 'GROUP',
    title: '「abby GROUP」グループポータルサイトを開設しました。',
  },
  {
    date: '2026.10.07',
    category: 'GROUP',
    title: 'グループ3社（株式会社abby／株式会社Abby auction／株式会社Abby Solution）の公式サイトへのリンクを掲載しました。',
  },
]

/*
 * NEWS の表示スイッチ。
 * ヘッダー/フッターのナビの「NEWS」と、トップの NEWS セクションをまとめて制御します。
 *   true  … 表示（事実ベースの告知2件を掲載中）
 *   false … 一時的に非表示（NEWS を正式公開したら true に戻す）
 */
const SHOW_NEWS = true
const HAS_NEWS = SHOW_NEWS && NEWS.length > 0

/* ------------------------------------------------------------------ *
 * パーツ
 * ------------------------------------------------------------------ */

const ArrowIcon = () => (
  <svg class="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 9h13M9.5 3l6 6-6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="square" />
  </svg>
)

const ArrowUpRight = () => (
  <svg class="arrow-ur" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 11L11 3M4.5 3H11v6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="square" />
  </svg>
)

const Header = () => (
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="abby GROUP ホーム">
        <span class="brand-mark">abby</span>
        <span class="brand-sub">
          <span>G</span>
          <span>R</span>
          <span>O</span>
          <span>U</span>
          <span>P</span>
        </span>
      </a>

      <nav class="global-nav" aria-label="グローバルナビゲーション">
        <a href="/#about">ABOUT</a>
        <a href="/#business">BUSINESS</a>
        <a href="/#philosophy">PHILOSOPHY</a>
        <div class="nav-item has-dropdown">
          <a href="/#companies" aria-haspopup="true">
            GROUP COMPANIES
          </a>
          <div class="nav-dropdown" role="menu" aria-label="グループ会社">
            <a role="menuitem" href="https://abby-inc.com/" target="_blank" rel="noopener noreferrer">
              株式会社abby
            </a>
            <a role="menuitem" href="https://abby-auction.com/" target="_blank" rel="noopener noreferrer">
              株式会社Abby auction
            </a>
            <a role="menuitem" href="https://abby-hr.com/" target="_blank" rel="noopener noreferrer">
              株式会社Abby Solution
            </a>
            <a class="nav-dropdown-all" role="menuitem" href="/group">
              グループ概要を見る
            </a>
          </div>
        </div>
        {HAS_NEWS ? <a href="/#news">NEWS</a> : null}
      </nav>

      <div class="header-cta">
        <a class="btn-contact" href="/#contact">
          CONTACT
        </a>
      </div>

      <button class="nav-toggle" id="nav-toggle" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-nav">
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="mobile-nav" id="mobile-nav" hidden>
      <a href="/#about">ABOUT</a>
      <a href="/#business">BUSINESS</a>
      <a href="/#philosophy">PHILOSOPHY</a>
      <a href="/#companies">GROUP COMPANIES</a>
      <a href="/group">GROUP OVERVIEW</a>
      {HAS_NEWS ? <a href="/#news">NEWS</a> : null}
      <a href="/#contact">CONTACT</a>
    </div>
  </header>
)

/* ファーストビュー — ブランドイエロー × マスコット（猫）＋タイポグラフィ。
   左にロゴ／タグライン／事業ドメイン、右にマスコットを配置する。 */
const BrandHero = () => (
  <section class="brand-hero" id="brand-hero">
    <picture>
      <source srcset="/static/img/cat-hero.webp" type="image/webp" />
      <img
        class="brand-hero-cat"
        src="/static/img/cat-hero.png"
        alt="abby GROUP のマスコット"
        width="802"
        height="926"
        decoding="async"
        fetchpriority="high"
      />
    </picture>
    <div class="brand-hero-inner">
      <h1 class="brand-hero-logo" aria-label="abby GROUP">
        <span class="brand-hero-mark">abby</span>
        <span class="brand-hero-sub" aria-hidden="true">
          <span>G</span>
          <span>R</span>
          <span>O</span>
          <span>U</span>
          <span>P</span>
        </span>
      </h1>

      <p class="brand-hero-tagline">
        価値をつなぎ、
        <br />
        可能性をひらく。
      </p>

      <p class="brand-hero-domains">
        <span>REUSE</span>
        <span class="sep" aria-hidden="true">/</span>
        <span>AUCTION</span>
        <span class="sep" aria-hidden="true">/</span>
        <span>HUMAN RESOURCES</span>
      </p>
    </div>
  </section>
)

const Hero = () => (
  <section class="hero" id="hero">
    <div class="hero-content">
      <p class="eyebrow light">abby GROUP</p>
      <h2 class="hero-title">
        価値をつなぎ、
        <br />
        可能性をひらく。
      </h2>

      <div class="hero-foot">
        <p class="hero-sub">
          モノに、新たな価値を。
          <br />
          人に、新たな可能性を。
          <br />
          企業に、新たな成長を。
        </p>
        <div class="hero-note">
          <p class="hero-desc">
            abby GROUPは、リユース・オークション・人材という事業を通じて、まだ眠っている価値を見つけ、次の未来へつないでいきます。
          </p>
          <a class="cta-line light" href="#business">
            <span>OUR BUSINESS</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </div>

    <span class="scroll-hint" aria-hidden="true">SCROLL</span>
  </section>
)

const About = () => (
  <section class="section about" id="about">
    <div class="wrap">
      <header class="sec-head reveal">
        <p class="eyebrow">ABOUT abby GROUP</p>
        <h2 class="sec-title">
          まだ見えていない価値を、
          <br />
          次へ。
        </h2>
      </header>

      <div class="about-grid">
        <div class="about-body reveal">
          <p>価値あるモノが、必要とする人へ渡っていくこと。</p>
          <p>一人ひとりが、自分の可能性を活かせる場所と出会うこと。</p>
          <p>企業が、新たな人や機会と出会い、成長していくこと。</p>
          <p class="about-lead">
            abby GROUPは、リユース・オークション・人材という領域から、
            <br />
            モノ・人・企業の価値を見つけ、新たな可能性へつないでいきます。
          </p>
        </div>
      </div>
    </div>
  </section>
)

const Business = () => (
  <section class="section business" id="business">
    <div class="wrap">
      <header class="sec-head center reveal">
        <p class="eyebrow">OUR BUSINESS</p>
        <h2 class="sec-title">
          3つの事業から、
          <br />
          新しい価値を生み出す。
        </h2>
      </header>
    </div>

    {COMPANIES.map((co) => (
      <article class={`biz-block ${co.category === 'AUCTION' ? 'is-dark' : ''}`} data-cat={co.category}>
        <div class="biz-inner">
          <div class="biz-head">
            <span class="biz-no">{co.no}</span>
            <span class="biz-cat">{co.category}</span>
          </div>

          <div class="biz-body">
            <p class="biz-label">{co.label}</p>
            <h3 class="biz-name">{co.name}</h3>
            <p class="biz-lead">{co.lead}</p>

            <div class="biz-text">
              {co.body.map((line) => (
                <p>{line}</p>
              ))}
            </div>

            {co.url ? (
              <a class="cta-line" href={co.url} target="_blank" rel="noopener noreferrer">
                <span>VIEW WEBSITE</span>
                <ArrowUpRight />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    ))}
  </section>
)

const ValueCreation = () => {
  const values = [
    { en: 'VALUE OF THINGS', jp: 'モノの価値', text: '見極め、次の人へつなぐ。' },
    { en: 'VALUE OF MARKET', jp: '市場の価値', text: 'つなぎ、新しい流通を生む。' },
    { en: 'VALUE OF PEOPLE', jp: '人の価値', text: '引き出し、成長へつなぐ。' },
  ]
  return (
    <section class="section cycle" id="cycle">
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">OUR VALUE CREATION</p>
          <h2 class="sec-title">
            3つの価値を、
            <br />
            生み出しつづける。
          </h2>
        </header>

        <ol class="cycle-flow">
          {values.map((s, i) => (
            <li class="cycle-step reveal" style={`--i:${i}`}>
              <span class="cycle-dot" aria-hidden="true"></span>
              <p class="cycle-cat">{s.en}</p>
              <p class="cycle-label">{s.jp}</p>
              <p class="cycle-text">{s.text}</p>
            </li>
          ))}
        </ol>

        <p class="cycle-out reveal">
          モノ・市場・人。
          <br />
          abby GROUPは、それぞれの価値を生み出すグループです。
        </p>
      </div>
    </section>
  )
}

const Philosophy = () => (
  <section class="section philosophy" id="philosophy">
    <div class="philosophy-inner">
      <div class="wrap">
        <p class="eyebrow light reveal">PHILOSOPHY</p>
        <h2 class="philosophy-title reveal">
          価値は、
          <br />
          見つけることで変わる。
        </h2>

        <div class="philosophy-body reveal">
          <p>
            価値がないのではなく、
            <br />
            まだ、その価値が見つけられていないだけかもしれない。
          </p>
          <p>
            それは、モノも、人も、事業も同じです。
          </p>
          <p>
            一つひとつの価値と向き合い、
            <br />
            その可能性を最大限に引き出すことで、
          </p>
          <p>
            新しい市場、新しいキャリア、
            <br />
            新しい未来を生み出していきます。
          </p>
        </div>
      </div>

      <div class="mv-dark" id="mission">
        <div class="wrap">
          <div class="mv-row reveal">
            <p class="mv-label">MISSION</p>
            <p class="mv-text">
              価値をつなぎ、
              <br />
              新しい可能性を生み出す。
            </p>
          </div>
          <div class="mv-row reveal">
            <p class="mv-label">VISION</p>
            <p class="mv-text">
              世界中の価値が、
              <br />
              正しく巡る社会へ。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const GroupCompanies = () => {
  const list = [
    { name: '株式会社abby', cat: 'REUSE', url: 'https://abby-inc.com/' },
    { name: '株式会社Abby auction', cat: 'AUCTION', url: 'https://abby-auction.com/' },
    { name: '株式会社Abby Solution', cat: 'HUMAN RESOURCES', url: 'https://abby-hr.com/' },
  ]
  return (
    <section class="section companies" id="companies">
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">GROUP COMPANIES</p>
          <h2 class="sec-title">グループ企業</h2>
        </header>

        <ul class="company-list">
          {list.map((c) => (
            <li class="company-row reveal">
              <div class="company-main">
                <p class="company-name">{c.name}</p>
                <p class="company-cat">{c.cat}</p>
              </div>
              {c.url ? (
                <a class="company-link" href={c.url} target="_blank" rel="noopener noreferrer">
                  <span>VIEW WEBSITE</span>
                  <ArrowUpRight />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const Future = () => (
  <section class="section future" id="future">
    <div class="wrap future-inner">
      <p class="eyebrow light reveal">OUR FUTURE</p>
      <h2 class="future-title reveal">
        まだない価値を、
        <br />
        次の事業へ。
      </h2>
      <div class="future-body reveal">
        <p>
          私たちが目指しているのは、
          <br />
          既存の事業を大きくすることだけではありません。
        </p>
        <p>
          国内外への事業展開。
          <br />
          新しい市場への挑戦。
          <br />
          既存領域を越えた、新たな価値の創出。
        </p>
        <p>
          社会の変化を捉え、
          <br />
          これから必要とされる事業を生み出していきます。
        </p>
      </div>

      <div class="future-formula reveal" aria-label="事業の掛け合わせ">
        <span>REUSE</span>
        <span class="op">×</span>
        <span>AUCTION</span>
        <span class="op">×</span>
        <span>HUMAN RESOURCES</span>
        <span class="op">×</span>
        <span class="next">NEXT</span>
      </div>
    </div>
  </section>
)

const FAQ: { q: string; a: string }[] = [
  {
    q: '事業提携や協業について相談できますか？',
    a: 'はい。リユース・オークション・人材ソリューションの各領域において、事業提携や協業のご相談を承っています。お問い合わせフォームよりご連絡ください。',
  },
  {
    q: '取材・メディア掲載の依頼はできますか？',
    a: 'はい。取材・掲載のご依頼は、お問い合わせフォームの「メディア取材」よりご連絡ください。内容を確認のうえ、担当者よりご連絡いたします。',
  },
  {
    q: '採用について知りたいのですが。',
    a: '採用に関するお問い合わせは、お問い合わせフォームの「採用」よりご連絡ください。なお、募集状況は各グループ会社ごとに異なります。',
  },
  {
    q: '各グループ会社へ直接問い合わせることはできますか？',
    a: 'はい。各グループ会社の公式サイトへのリンクを掲載していますので、そちらより直接お問い合わせください。',
  },
  {
    q: 'abby GROUPは法人ですか？',
    a: 'abby GROUPは、株式会社abby、株式会社Abby auction、株式会社Abby Solutionによるグループブランドです。各社はそれぞれ独立した法人です。',
  },
]

const Faq = () => (
  <section class="section faq" id="faq">
    <div class="wrap">
      <header class="sec-head reveal">
        <p class="eyebrow">FAQ</p>
        <h2 class="sec-title">よくあるご質問</h2>
      </header>

      <dl class="faq-list">
        {FAQ.map((item, i) => (
          <div class="faq-item reveal" style={`--i:${i}`}>
            <dt class="faq-q">
              <span class="faq-mark" aria-hidden="true">Q</span>
              <span>{item.q}</span>
            </dt>
            <dd class="faq-a">
              <span class="faq-mark" aria-hidden="true">A</span>
              <span>{item.a}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p class="faq-note reveal">
        上記に該当しないご質問は、
        <a class="faq-link" href="/#contact">
          お問い合わせ
        </a>
        よりご連絡ください。
      </p>
    </div>
  </section>
)

const News = () => {
  // ニュースが未登録の場合はセクション自体を出力しない
  if (!HAS_NEWS) return null

  return (
    <section class="section news" id="news">
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">NEWS</p>
          <h2 class="sec-title">お知らせ</h2>
        </header>

        <ul class="news-list">
          {NEWS.map((n) => {
            const isExternal = !!n.url && /^https?:\/\//.test(n.url)
            const inner = (
              <>
                <span class="news-date">{n.date}</span>
                <span class="news-cat">{n.category}</span>
                <span class="news-title">{n.title}</span>
                <span class="news-arrow" aria-hidden="true">
                  {n.url ? <ArrowUpRight /> : null}
                </span>
              </>
            )
            return (
              <li class={`news-row reveal${n.url ? '' : ' is-static'}`}>
                {n.url ? (
                  <a
                    href={n.url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {inner}
                  </a>
                ) : (
                  <div class="news-static">{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const Contact = () => (
  <section class="section contact" id="contact">
    <div class="wrap contact-inner">
      <p class="eyebrow light reveal">CONTACT</p>
      <h2 class="contact-title reveal">
        新しい可能性を、
        <br />
        一緒につくりませんか。
      </h2>
      <p class="contact-body reveal">
        サービスに関するお問い合わせ、事業提携、採用、メディア取材など、
        <br />
        abby GROUPへのお問い合わせはこちらから。
      </p>
      <div class="contact-cta reveal">
        <a class="btn-primary" href="/contact">
          CONTACT US
        </a>
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <p class="footer-logo">
            <span class="brand-mark">abby</span>
            <span class="brand-sub">
              <span>G</span>
              <span>R</span>
              <span>O</span>
              <span>U</span>
              <span>P</span>
            </span>
          </p>
          <p class="footer-copy">
            価値をつなぎ、
            <br />
            可能性をひらく。
          </p>
        </div>

        <nav class="footer-nav" aria-label="フッターナビゲーション">
          <ul class="footer-links">
            <li>
              <a href="/#about">ABOUT</a>
            </li>
            <li>
              <a href="/#business">BUSINESS</a>
            </li>
            <li>
              <a href="/#philosophy">PHILOSOPHY</a>
            </li>
            <li>
              <a href="/#companies">GROUP COMPANIES</a>
            </li>
            {HAS_NEWS ? (
              <li>
                <a href="/#news">NEWS</a>
              </li>
            ) : null}
            <li>
              <a href="/#contact">CONTACT</a>
            </li>
            <li>
              <a href="/privacy">PRIVACY POLICY</a>
            </li>
          </ul>

          <div class="footer-companies">
            <p class="footer-heading">GROUP COMPANIES</p>
            <ul>
              <li>
                <a href="https://abby-inc.com/" target="_blank" rel="noopener noreferrer">
                  株式会社abby
                </a>
              </li>
              <li>
                <a href="https://abby-auction.com/" target="_blank" rel="noopener noreferrer">
                  株式会社Abby auction
                </a>
              </li>
              <li>
                <a href="https://abby-hr.com/" target="_blank" rel="noopener noreferrer">
                  株式会社Abby Solution
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <p class="footer-legal">
        abby GROUPは、株式会社abby、株式会社Abby auction、株式会社Abby Solutionによるグループブランドです。
        各社はそれぞれ独立した法人です。
      </p>

      <p class="copyright">© abby GROUP. All Rights Reserved.</p>
    </div>
  </footer>
)

/* ------------------------------------------------------------------ *
 * ページ
 * ------------------------------------------------------------------ */

const HomePage = () => (
  <>
    <Header />
    <main>
      <BrandHero />
      <Hero />
      <About />
      <Business />
      <ValueCreation />
      <Philosophy />
      <GroupCompanies />
      <Future />
      <Faq />
      <News />
      <Contact />
    </main>
    <Footer />
  </>
)

const PageShell = ({ children }: { children?: any }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
)

const NotFoundPage = () => (
  <PageShell>
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">404 — NOT FOUND</p>
        <h1 class="page-title">ページが見つかりません</h1>
        <p class="page-lead">
          お探しのページは、移動または削除された可能性があります。
          <br />
          恐れ入りますが、下記よりお進みください。
        </p>
        <p class="notfound-actions">
          <a class="cta-line" href="/">
            <span>BACK TO TOP</span>
            <ArrowIcon />
          </a>
        </p>
      </div>
    </section>
  </PageShell>
)

const ContactPage = () => (
  <PageShell>
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">CONTACT</p>
        <h1 class="page-title">お問い合わせ</h1>
        <p class="page-lead">
          サービスに関するお問い合わせ、事業提携、採用、メディア取材など、
          <br />
          下記フォームよりお問い合わせください。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap form-wrap">
        <form class="contact-form" id="contact-form" novalidate>
          <div class="form-field">
            <label for="cf-type">お問い合わせ種別 <span class="req">必須</span></label>
            <select id="cf-type" name="type" required>
              <option value="">選択してください</option>
              <option value="サービスに関するお問い合わせ">サービスに関するお問い合わせ</option>
              <option value="事業提携">事業提携</option>
              <option value="採用">採用</option>
              <option value="メディア取材">メディア取材</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div class="form-field">
            <label for="cf-company">会社名 / 組織名</label>
            <input type="text" id="cf-company" name="company" autocomplete="organization" />
          </div>

          <div class="form-field">
            <label for="cf-name">お名前 <span class="req">必須</span></label>
            <input type="text" id="cf-name" name="name" required autocomplete="name" />
          </div>

          <div class="form-field">
            <label for="cf-email">メールアドレス <span class="req">必須</span></label>
            <input type="email" id="cf-email" name="email" required autocomplete="email" />
          </div>

          <div class="form-field">
            <label for="cf-message">お問い合わせ内容 <span class="req">必須</span></label>
            <textarea id="cf-message" name="message" rows={6} required></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">送信する</button>
            <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
    </section>
  </PageShell>
)

const PrivacyPage = () => (
  <PageShell>
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">PRIVACY POLICY</p>
        <h1 class="page-title">プライバシーポリシー</h1>
        <p class="page-lead">
          abby GROUP（以下「本グループ」といいます。）は、本ウェブサイトおよび本グループ各社の事業活動において取得する個人情報の重要性を認識し、
          個人情報の保護に関する法律その他の関係法令等を遵守し、適切に取り扱います。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap prose">
        <h2>1. 基本方針</h2>
        <p>
          本グループは、本ウェブサイトおよび本グループ各社の事業活動を通じて取得する個人情報の重要性を認識し、
          個人情報の保護に関する法律その他の関係法令・ガイドライン等を遵守し、個人情報を適切に取り扱います。
        </p>

        <h2>2. 取得する情報</h2>
        <p>
          本グループは、適法かつ公正な手段により、利用目的の達成に必要な範囲で個人情報を取得します。
          本ウェブサイトのお問い合わせフォームを通じては、お問い合わせ種別、会社名・組織名、お名前、メールアドレス、
          お問い合わせ内容をご入力いただく場合があります。
        </p>

        <h2>3. 利用目的</h2>
        <p>取得した個人情報は、次の目的で利用します。</p>
        <ul class="prose-list">
          <li>お問い合わせへの回答および必要なご連絡</li>
          <li>事業に関するご相談・事業提携に関するご連絡</li>
          <li>採用選考および採用に関するご連絡</li>
          <li>メディア取材・掲載に関するご連絡</li>
          <li>本グループのサービス提供・品質改善</li>
        </ul>
        <p>上記以外の目的で利用する場合は、あらためてご本人の同意を得るものとします。</p>

        <h2>4. 第三者提供</h2>
        <p>
          本グループは、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
        </p>

        <h2>5. 委託の取り扱い</h2>
        <p>
          利用目的の達成に必要な範囲で個人情報の取り扱いを外部に委託する場合は、委託先において個人情報が適切に
          管理されるよう、必要かつ適切な監督を行います。
        </p>

        <h2>6. 安全管理措置</h2>
        <p>
          本グループは、個人情報の漏えい、滅失またはき損の防止その他の個人情報の安全管理のために、
          必要かつ適切な措置を講じます。
        </p>

        <h2>7. Cookie・アクセス解析</h2>
        <p>
          本ウェブサイトでは、利便性の向上および利用状況の把握のために、Cookie 等の技術やアクセス解析ツールを
          利用する場合があります。これらにより取得される情報には、個人を特定する情報は含まれません。
          ブラウザの設定により Cookie を無効化することも可能ですが、その場合、一部機能が正常に動作しないことがあります。
        </p>

        <h2>8. 開示・訂正・削除等の請求</h2>
        <p>
          ご本人からの求めにより、保有個人データの開示、訂正、追加、削除、利用停止等に応じます。
          ご請求の際は、下記のお問い合わせ窓口までご連絡ください。ご本人であることを確認したうえで、
          法令に従い対応いたします。
        </p>

        <h2>9. お問い合わせ窓口</h2>
        <p>
          本ポリシーおよび個人情報の取り扱いに関するお問い合わせは、本ウェブサイトの
          <a class="faq-link" href="/#contact">
            お問い合わせフォーム
          </a>
          よりご連絡ください。
        </p>

        <h2>10. 本ポリシーの改定</h2>
        <p>
          本ポリシーの内容は、法令の改正等に応じて、予告なく変更することがあります。
          変更後の内容は、本ウェブサイトに掲載した時点から効力を生じるものとします。
        </p>

        <p class="prose-note">制定日：2026年10月7日</p>
      </div>
    </section>
  </PageShell>
)

/* ------------------------------------------------------------------ *
 * GROUP OVERVIEW（グループ概要）
 * abby GROUPはグループブランドであり法人ではありません。
 * 各事業会社はそれぞれ独立した法人です。
 * ------------------------------------------------------------------ */
const GroupPage = () => (
  <PageShell>
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">GROUP OVERVIEW</p>
        <h1 class="page-title">グループ概要</h1>
        <p class="page-lead">
          abby GROUPは、リユース・オークション・人材ソリューションの3つの事業を展開するグループブランドです。
          <br />
          モノ・市場・人という3つの価値に向き合い、それぞれの可能性を次へつないでいきます。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">OUR BUSINESS</p>
          <h2 class="sec-title">3つの事業</h2>
        </header>

        <ul class="company-list">
          {COMPANIES.map((c) => (
            <li class="company-row reveal">
              <div class="company-main">
                <p class="company-name">{c.name}</p>
                <p class="company-cat">{c.category}</p>
                <p class="company-desc">{c.body[0]}</p>
              </div>
              <a class="company-link" href={c.url} target="_blank" rel="noopener noreferrer">
                <span>VIEW WEBSITE</span>
                <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section class="section group-note">
      <div class="wrap prose">
        <h2>グループの成り立ち</h2>
        <p>
          abby GROUPは、株式会社abby、株式会社Abby auction、株式会社Abby Solutionの3社によるグループブランドです。
          各社はそれぞれ独立した法人であり、それぞれの事業領域で価値の創出に取り組んでいます。
        </p>
        <p>
          「価値をつなぎ、可能性をひらく。」という考えのもと、モノの価値、市場の価値、人の価値を生み出し、
          新しい流通・新しいキャリア・新しい成長の機会を社会へつないでいきます。
        </p>
        <h2>各社について</h2>
        <ul class="prose-list">
          <li>
            <strong>株式会社abby</strong> — ブランド品・ジュエリー・時計を中心としたリユース事業（買取・販売・卸）。
          </li>
          <li>
            <strong>株式会社Abby auction</strong> — ブランドジュエリー専門オークションの運営。
          </li>
          <li>
            <strong>株式会社Abby Solution</strong> — 営業支援・人材派遣・人材紹介などの人材ソリューション。
          </li>
        </ul>
        <p class="prose-note">
          各グループ会社へのお問い合わせは、各社の公式サイトより直接ご連絡ください。
        </p>
      </div>
    </section>
  </PageShell>
)

/* ------------------------------------------------------------------ *
 * ルーティング
 * ------------------------------------------------------------------ */

app.get('/', (c) => c.render(<HomePage />, { path: '/' }))

app.get('/contact', (c) =>
  c.render(<ContactPage />, {
    path: '/contact',
    title: 'お問い合わせ｜abby GROUP',
    description: 'サービスに関するお問い合わせ、事業提携、採用、メディア取材など、abby GROUPへのお問い合わせはこちらから。',
  }),
)

app.get('/privacy', (c) =>
  c.render(<PrivacyPage />, {
    path: '/privacy',
    title: 'プライバシーポリシー｜abby GROUP',
    description: 'abby GROUPのプライバシーポリシーです。',
  }),
)

/* ------------------------------------------------------------------ *
 * SEO: robots.txt / sitemap.xml
 * (_routes.json が /* を関数へ通すため、ルートで返すのが確実)
 * ------------------------------------------------------------------ */
const SITE_ORIGIN = 'https://abbygroup-inc.com'

app.get('/robots.txt', (c) =>
  c.text(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`),
)

app.get('/sitemap.xml', (c) => {
  const urls = ['/', '/group', '/contact', '/privacy']
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${SITE_ORIGIN}${u}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`
  return c.body(body, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

app.get('/group', (c) =>
  c.render(<GroupPage />, {
    path: '/group',
    title: 'グループ概要｜abby GROUP',
    description:
      'abby GROUPは、リユース・オークション・人材ソリューションの3つの事業を展開するグループブランドです。グループ概要をご案内します。',
  }),
)

/* ------------------------------------------------------------------ *
 * API: お問い合わせ
 * D1(DB) バインディングがあれば保存、なければ受理のみ（フォームは常に動作）
 * ------------------------------------------------------------------ */
app.post('/api/contact', async (c) => {
  let payload: Record<string, unknown>
  try {
    payload = await c.req.json()
  } catch {
    return c.json({ success: false, message: 'リクエストの形式が正しくありません。' }, 400)
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const type = str(payload.type)
  const company = str(payload.company)
  const name = str(payload.name)
  const email = str(payload.email)
  const message = str(payload.message)

  if (!type || !name || !email || !message) {
    return c.json({ success: false, message: '必須項目をすべて入力してください。' }, 400)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ success: false, message: 'メールアドレスの形式が正しくありません。' }, 400)
  }
  if (message.length > 5000) {
    return c.json({ success: false, message: 'お問い合わせ内容が長すぎます。' }, 400)
  }

  if (c.env.DB) {
    try {
      await c.env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS contacts (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           type TEXT NOT NULL,
           company TEXT,
           name TEXT NOT NULL,
           email TEXT NOT NULL,
           message TEXT NOT NULL,
           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
         )`,
      ).run()

      await c.env.DB.prepare(
        `INSERT INTO contacts (type, company, name, email, message) VALUES (?, ?, ?, ?, ?)`,
      )
        .bind(type, company, name, email, message)
        .run()
    } catch (err) {
      console.error('contact insert failed', err)
      return c.json({ success: false, message: '保存に失敗しました。時間をおいて再度お試しください。' }, 500)
    }
  }

  return c.json({ success: true, message: '送信が完了しました。' })
})

app.notFound((c) => {
  c.status(404)
  return c.render(<NotFoundPage />, { path: c.req.path, title: 'ページが見つかりません｜abby GROUP' })
})

export default app

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
  image: string
  imageAlt: string
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
      'ブランド品・ジュエリー・時計などを中心に、買取・販売・卸を展開するリユース事業。',
      '一つひとつのモノが持つ価値を見極め、次に必要とする人へつないでいきます。',
    ],
    image: '/static/img/biz-reuse.jpg',
    imageAlt: '時計・ジュエリー・ブランド品（モノトーン）',
    lead: 'モノの価値を見極め、\n次に必要とする人へ。',
  },
  {
    no: '02',
    category: 'AUCTION',
    label: 'オークション事業',
    name: '株式会社Abby auction',
    url: '',
    external: false,
    body: [
      'ブランドジュエリー専門オークション「Abb auction byOKURA」を運営。',
      '売り手と買い手、商品と新しい市場をつなぎ、リユース市場に新たな流通を生み出します。',
    ],
    image: '/static/img/biz-auction.jpg',
    imageAlt: 'オークションのための上質な空間（モノトーン）',
    lead: '価値を市場につなぎ、\n新たな流通を生み出す。',
  },
  {
    no: '03',
    category: 'HUMAN RESOURCES',
    label: '人材ソリューション事業',
    name: '株式会社Abb Solution',
    url: 'https://abby-hr.com/',
    external: true,
    body: [
      '営業支援で培った人材選定・育成・マネジメントのノウハウを活かし、',
      '営業支援・人材派遣・人材紹介などの人材ソリューションを提供します。',
      '人の可能性と企業の成長をつなぎます。',
    ],
    image: '/static/img/biz-hr.jpg',
    imageAlt: 'ビジネス・チーム・打ち合わせの様子',
    lead: '人の可能性と、\n企業の成長をつなぐ。',
  },
]

type NewsItem = { date: string; category: string; title: string; url: string }

const NEWS: NewsItem[] = [
  {
    date: '2024.00.00',
    category: 'GROUP',
    title: 'abby GROUP グループポータルサイトを公開しました。（サンプル）',
    url: '#',
  },
  {
    date: '2024.00.00',
    category: 'REUSE',
    title: '株式会社abby に関するお知らせが入ります。（サンプル）',
    url: '#',
  },
  {
    date: '2024.00.00',
    category: 'AUCTION',
    title: '株式会社Abby auction に関するお知らせが入ります。（サンプル）',
    url: '#',
  },
  {
    date: '2024.00.00',
    category: 'HUMAN RESOURCES',
    title: '株式会社Abb Solution に関するお知らせが入ります。（サンプル）',
    url: '#',
  },
]

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
        <span class="brand-sub">GROUP</span>
      </a>

      <nav class="global-nav" aria-label="グローバルナビゲーション">
        <a href="/#about">ABOUT</a>
        <a href="/#business">BUSINESS</a>
        <a href="/#philosophy">PHILOSOPHY</a>
        <a href="/#companies">GROUP COMPANIES</a>
        <a href="/#news">NEWS</a>
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
      <a href="/#news">NEWS</a>
      <a href="/#contact">CONTACT</a>
    </div>
  </header>
)

const Hero = () => (
  <section class="hero" id="hero">
    <div class="hero-media">
      <img src="/static/img/hero-architecture.jpg" alt="都市と建築が織りなす現代的な風景" loading="eager" />
      <span class="hero-scrim" aria-hidden="true"></span>
    </div>

    <div class="hero-content">
      <p class="eyebrow light">abby GROUP</p>
      <h1 class="hero-title">
        価値をつなぎ、
        <br />
        可能性をひらく。
      </h1>

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
          <p>
            価値あるモノが、
            <br />
            必要とする人へ渡っていくこと。
          </p>
          <p>
            一人ひとりが、
            <br />
            自分の可能性を活かせる場所と出会うこと。
          </p>
          <p>
            企業が、
            <br />
            新たな人や機会と出会い、成長していくこと。
          </p>
          <p class="about-lead">
            abby GROUPは、リユース、オークション、人材という異なる領域から、モノ・人・企業が持つ価値を見つけ、新たな可能性へとつないでいます。
          </p>
          <p class="about-lead">
            事業領域にとらわれることなく、社会に必要とされる価値を生み出し続けます。
          </p>
        </div>

        <figure class="about-figure reveal">
          <img src="/static/img/about-city.jpg" alt="都市のビルディング（モノトーン）" loading="lazy" />
        </figure>
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
          <figure class="biz-media">
            <img src={co.image} alt={co.imageAlt} loading="lazy" />
          </figure>

          <div class="biz-body">
            <div class="biz-head">
              <span class="biz-no">{co.no}</span>
              <span class="biz-cat">{co.category}</span>
            </div>
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
            ) : (
              <span class="cta-line is-pending">
                <span>VIEW WEBSITE</span>
                <span class="pending-note">準備中</span>
              </span>
            )}
          </div>
        </div>
      </article>
    ))}
  </section>
)

const ValueCycle = () => {
  const steps = [
    { cat: 'REUSE', label: 'リユース事業', text: '価値を見つける。' },
    { cat: 'AUCTION', label: 'オークション事業', text: '価値を市場につなぐ。' },
    { cat: 'HUMAN RESOURCES', label: '人材ソリューション事業', text: '人の力で事業を動かす。' },
  ]
  return (
    <section class="section cycle" id="cycle">
      <div class="wrap">
        <header class="sec-head reveal">
          <p class="eyebrow">OUR VALUE CYCLE</p>
          <h2 class="sec-title">
            価値を見つけ、
            <br />
            価値をつなぎ、
            <br />
            可能性を広げる。
          </h2>
        </header>

        <ol class="cycle-flow">
          {steps.map((s, i) => (
            <li class="cycle-step reveal" style={`--i:${i}`}>
              <span class="cycle-dot" aria-hidden="true"></span>
              <p class="cycle-cat">{s.cat}</p>
              <p class="cycle-label">{s.label}</p>
              <p class="cycle-text">{s.text}</p>
            </li>
          ))}
        </ol>

        <p class="cycle-out reveal">
          <span class="cycle-out-x">×</span>
          3つの事業が循環し、
          <br />
          新しい価値を生み出していく。
        </p>
      </div>
    </section>
  )
}

const Philosophy = () => (
  <section class="section philosophy" id="philosophy">
    <div class="philosophy-media" aria-hidden="true">
      <img src="/static/img/philosophy-facade.jpg" alt="" loading="lazy" />
    </div>
    <div class="wrap philosophy-inner">
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
          それは、
          <br />
          モノも、人も、事業も同じです。
        </p>
        <p>
          私たちは、
          <br />
          一つひとつの価値と向き合い、
          <br />
          その可能性を最大限に引き出すことで、
        </p>
        <p>
          新しい市場、
          <br />
          新しいキャリア、
          <br />
          新しい未来を生み出していきます。
        </p>
      </div>
    </div>
  </section>
)

const MissionVision = () => (
  <section class="section mv" id="mission">
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
  </section>
)

const GroupCompanies = () => {
  const list = [
    { name: '株式会社abby', cat: 'REUSE', url: 'https://abby-inc.com/', note: '' },
    { name: '株式会社Abby auction', cat: 'AUCTION', url: '', note: 'Abb auction byOKURAを運営' },
    { name: '株式会社Abb Solution', cat: 'HUMAN RESOURCES', url: 'https://abby-hr.com/', note: '' },
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
                <p class="company-cat">{c.cat}</p>
                <p class="company-name">{c.name}</p>
                {c.note ? <p class="company-note">{c.note}</p> : null}
              </div>
              {c.url ? (
                <a class="company-link" href={c.url} target="_blank" rel="noopener noreferrer">
                  <span class="company-link-url">{c.url.replace('https://', '').replace(/\/$/, '')}</span>
                  <ArrowUpRight />
                </a>
              ) : (
                <span class="company-link is-pending">
                  <span class="company-link-url">準備中</span>
                </span>
              )}
            </li>
          ))}
        </ul>

        <p class="companies-note reveal">
          株式会社abby、株式会社Abby auction、株式会社Abb Solutionは、それぞれ独立した法人です。
        </p>
      </div>
    </section>
  )
}

const Future = () => (
  <section class="section future" id="future">
    <div class="future-media" aria-hidden="true">
      <img src="/static/img/future-stair.jpg" alt="" loading="lazy" />
    </div>
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
          リユース市場のさらなる拡大。
          <br />
          オークションを通じた国内外への流通。
          <br />
          人材領域における全国展開。
        </p>
        <p>
          ブルーカラー・海外人材など、
          <br />
          新たな人材市場への挑戦。
        </p>
        <p>
          社会の変化から生まれる課題を捉え、
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

const News = () => (
  <section class="section news" id="news">
    <div class="wrap">
      <header class="sec-head reveal">
        <p class="eyebrow">NEWS</p>
        <h2 class="sec-title">お知らせ</h2>
      </header>

      <ul class="news-list">
        {NEWS.map((n) => (
          <li class="news-row reveal">
            <a href={n.url}>
              <span class="news-date">{n.date}</span>
              <span class="news-cat">{n.category}</span>
              <span class="news-title">{n.title}</span>
              <span class="news-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div class="news-foot reveal">
        <a class="cta-line" href="#news">
          <span>VIEW ALL</span>
          <ArrowIcon />
        </a>
        <p class="news-note">
          ※ 現在はサンプル表示です。CMSやデータソースに差し替えやすい構成で実装しています。
        </p>
      </div>
    </div>
  </section>
)

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
            <span class="brand-sub">GROUP</span>
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
            <li>
              <a href="/#news">NEWS</a>
            </li>
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
                <span class="is-pending">株式会社Abby auction</span>
              </li>
              <li>
                <a href="https://abby-hr.com/" target="_blank" rel="noopener noreferrer">
                  株式会社Abb Solution
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <p class="footer-legal">
        abby GROUPは、株式会社abby、株式会社Abby auction、株式会社Abb Solutionによるグループブランドです。
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
      <Hero />
      <About />
      <Business />
      <ValueCycle />
      <Philosophy />
      <MissionVision />
      <GroupCompanies />
      <Future />
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
      </div>
    </section>

    <section class="section">
      <div class="wrap prose">
        <p>
          abby GROUP（以下「本グループ」といいます。）は、本ウェブサイトおよび本グループ各社の事業活動において取得する個人情報の重要性を認識し、
          個人情報の保護に関する法律その他の関係法令等を遵守し、適切に取り扱います。
        </p>

        <h2>1. 個人情報の取得</h2>
        <p>本グループは、適法かつ公正な手段により、必要な範囲で個人情報を取得します。</p>

        <h2>2. 利用目的</h2>
        <p>
          取得した個人情報は、お問い合わせへの回答、事業に関するご連絡、採用選考、および本グループのサービス提供・改善のために利用します。
        </p>

        <h2>3. 第三者提供</h2>
        <p>
          法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
        </p>

        <h2>4. 安全管理</h2>
        <p>
          個人情報の漏えい、滅失またはき損の防止その他の安全管理のために、必要かつ適切な措置を講じます。
        </p>

        <h2>5. お問い合わせ窓口</h2>
        <p>本ポリシーに関するお問い合わせは、本ウェブサイトのお問い合わせフォームよりご連絡ください。</p>

        <h2>6. 改定</h2>
        <p>本ポリシーの内容は、法令の改正等に応じて、予告なく変更することがあります。</p>

        <p class="prose-note">
          ※ 本ページは雛形です。正式な内容は、本グループの定める規程・方針に基づき確定してください。
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

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 90 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] } },
}

const viewportOpts = { once: true, margin: '-20px' }

export function LogoContent() {
  return (
    <div className="bg-[#215234] text-[#FDF2D4]">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-20 py-16 md:py-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-lg text-[rgba(253,242,212,0.5)] mb-10">
          <Link href="/" className="hover:text-[#FDF2D4] transition-colors">홈</Link>
          <span>›</span>
          <Link href="/about" className="hover:text-[#FDF2D4] transition-colors">총회소개</Link>
          <span>›</span>
          <span className="text-[rgba(253,242,212,0.8)]">총회로고</span>
        </nav>

        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#C99025] mb-8"
        >
          <span>MRA · 2023</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FDF2D4]" />
          <span>The Emblem Explained</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.05] tracking-[-0.02em] text-[#FDF2D4] mb-3"
        >
          A shield, a cross,<br className="hidden sm:block" /> and a circle without end.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.14 }}
          className="text-xl sm:text-2xl md:text-[32px] font-medium text-[#F1C66B] mb-14 tracking-[-0.01em]"
        >
          방패와 십자가, 그리고 끝이 없는 원.
        </motion.p>

        {/* Hero */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-10 md:gap-14 items-start py-10 md:py-12 border-t-2 border-[#E3A833] border-b border-b-[rgba(253,242,212,0.18)]"
        >
          {/* 로고 이미지 — hover scale */}
          <motion.div
            className="shrink-0 mx-auto md:mx-0 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          >
            <Image
              src="/images/logo.jpg"
              alt="마스터스 개혁파 총회 엠블럼"
              width={280}
              height={280}
              className="rounded-full object-cover shadow-[0_16px_48px_rgba(0,0,0,0.32),0_0_0_4px_rgba(227,168,51,0.25)]"
            />
          </motion.div>
          <div>
            <p className="text-lg md:text-[22px] leading-[1.55] text-[#FDF2D4] mt-0 md:mt-6">
              The Masters Reformed Assembly emblem layers four symbols — a shield, a cross, a colored field, and an unbroken ring — into a single confession of Reformed faith.
            </p>
            <p className="text-[15px] md:text-[17px] leading-[1.7] text-[rgba(253,242,212,0.78)] mt-5">
              마스터스 개혁파 총회의 엠블럼은 방패, 십자가, 색의 영역, 그리고 끊어지지 않는 원 — 네 가지 상징을 하나의 개혁주의 신앙 고백으로 엮어냅니다.
            </p>
          </div>
        </motion.div>

        {/* Section 01 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="py-14 md:py-20 border-b border-[rgba(253,242,212,0.14)] grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-12"
        >
          <div className="font-serif text-7xl md:text-[80px] font-normal italic text-[#E3A833] leading-none">01</div>
          <div>
            <h2 className="text-2xl md:text-[36px] font-semibold tracking-[-0.01em] text-[#FDF2D4] mb-2">The Shield · Faith&apos;s Protection</h2>
            <p className="text-base md:text-lg font-medium text-[#F1C66B] mb-6">방패 — 신앙의 보호</p>
            <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#FDF2D4] mb-4">
              At the center stands a shield — the emblem&apos;s structural heart. It signifies{' '}
              <span className="text-[#F1C66B]">the protection of faith</span>: the church&apos;s calling to defend the gospel against attacks from without and erosion from within.
            </p>
            <p className="text-sm md:text-[15px] leading-[1.8] text-[rgba(253,242,212,0.72)]">
              중앙에는 방패가 자리합니다. 방패는 외부의 공격으로부터 신앙을 지키는{' '}
              <span className="text-[#F1C66B]">&lsquo;믿음의 보호&rsquo;</span>를 의미합니다. 시대가 어떻게 흐르더라도, 교회는 복음을 지켜내야 합니다.
            </p>
          </div>
        </motion.section>

        {/* Section 02 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="py-14 md:py-20 border-b border-[rgba(253,242,212,0.14)] grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-12"
        >
          <div className="font-serif text-7xl md:text-[80px] font-normal italic text-[#E3A833] leading-none">02</div>
          <div>
            <h2 className="text-2xl md:text-[36px] font-semibold tracking-[-0.01em] text-[#FDF2D4] mb-2">The Cross · Christ&apos;s Redemption</h2>
            <p className="text-base md:text-lg font-medium text-[#F1C66B] mb-6">십자가 — 그리스도의 구속</p>
            <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#FDF2D4] mb-4">
              Across the shield rises the cross — the redemption of Jesus Christ and the gospel-centered faith of the Reformed tradition. Together with the shield, it declares: through every era and cultural shift, the church holds firm to the gospel of the cross.
            </p>
            <p className="text-sm md:text-[15px] leading-[1.8] text-[rgba(253,242,212,0.72)]">
              방패 위로 십자가가 솟습니다. 십자가는 예수 그리스도의 구속과 복음 중심 신앙을 의미합니다. 어떤 시대적 흐름 속에서도 십자가 복음을 중심으로 신앙을 지켜낸다는 의미를 담고 있습니다.
            </p>
          </div>
        </motion.section>

        {/* Section 03 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="py-14 md:py-20 border-b border-[rgba(253,242,212,0.14)] grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-12"
        >
          <div className="font-serif text-7xl md:text-[80px] font-normal italic text-[#E3A833] leading-none">03</div>
          <div>
            <h2 className="text-2xl md:text-[36px] font-semibold tracking-[-0.01em] text-[#FDF2D4] mb-2">Gold &amp; Green · Glory and Growth</h2>
            <p className="text-base md:text-lg font-medium text-[#F1C66B] mb-6">금색과 녹색 — 영광과 성화</p>
            <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#FDF2D4] mb-4">
              <span className="text-[#F1C66B] font-semibold">Gold</span> signifies the glory of God, the purity of truth, and the unchanging gospel.{' '}
              <span className="text-[#F1C66B] font-semibold">Green</span> signifies life, growth, and the sanctification of the saints. Side by side, they trace the Reformed flow of faith.
            </p>
            <p className="text-sm md:text-[15px] leading-[1.8] text-[rgba(253,242,212,0.72)] mb-6">
              금색은 하나님의 영광, 진리의 순수성, 변하지 않는 복음을 의미합니다. 녹색은 생명, 성장, 그리고 성도의 성화를 의미합니다.
            </p>
            {/* 컬러 스워치 — hover 시 위로 올라오는 효과 */}
            <div className="flex gap-4 mb-6">
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.28)' }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="flex-1 h-24 rounded-[4px] bg-[#E3A833] flex flex-col justify-end p-3 text-[#1E2C2B] cursor-default"
              >
                <div className="text-xs font-semibold tracking-[0.04em]">Gold · 금색</div>
                <div className="text-[11px] opacity-85 mt-0.5">Glory · Truth · Gospel</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.28)' }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="flex-1 h-24 rounded-[4px] bg-[#163A22] border border-[rgba(253,242,212,0.2)] flex flex-col justify-end p-3 text-[#FDF2D4] cursor-default"
              >
                <div className="text-xs font-semibold tracking-[0.04em]">Green · 녹색</div>
                <div className="text-[11px] opacity-85 mt-0.5">Life · Growth · Sanctification</div>
              </motion.div>
            </div>
            <blockquote className="bg-black/20 border-l-[3px] border-[#E3A833] px-6 py-5 text-base leading-[1.65] text-[#FDF2D4] italic">
              &ldquo;True doctrine gives glory to God, and on that foundation the saints live, move, and grow.&rdquo;
              <span className="not-italic block mt-2 text-[rgba(253,242,212,0.72)] text-sm">
                참된 교리는 하나님께 영광을 돌리며, 그 위에서 성도는 살아 움직이며 성장한다.
              </span>
            </blockquote>
          </div>
        </motion.section>

        {/* Section 04 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="py-14 md:py-20 border-b border-[rgba(253,242,212,0.14)] grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-12"
        >
          <div className="font-serif text-7xl md:text-[80px] font-normal italic text-[#E3A833] leading-none">04</div>
          <div>
            <h2 className="text-2xl md:text-[36px] font-semibold tracking-[-0.01em] text-[#FDF2D4] mb-2">The Outer Ring · Eternity &amp; the Church</h2>
            <p className="text-base md:text-lg font-medium text-[#F1C66B] mb-6">외곽의 원 — 영원성과 교회의 연속성</p>
            <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#FDF2D4] mb-4">
              The outer ring symbolizes <span className="text-[#F1C66B]">community</span> and <span className="text-[#F1C66B]">universality</span>. A circle has no beginning and no end — pointing to God&apos;s eternity and the unbroken continuity of the Church through every generation.
            </p>
            <p className="text-sm md:text-[15px] leading-[1.8] text-[rgba(253,242,212,0.72)]">
              외곽의 원형 띠는 공동체성과 보편성을 상징합니다. 원은 시작과 끝이 없는 형태로, 하나님의 영원성과 교회의 연속성을 의미합니다.
            </p>
          </div>
        </motion.section>

        {/* Section 05 */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="py-14 md:py-20 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-12"
        >
          <div className="font-serif text-7xl md:text-[80px] font-normal italic text-[#E3A833] leading-none">05</div>
          <div>
            <h2 className="text-2xl md:text-[36px] font-semibold tracking-[-0.01em] text-[#FDF2D4] mb-2">The Wordmark · Reformed by the Master&apos;s Will</h2>
            <p className="text-base md:text-lg font-medium text-[#F1C66B] mb-6">표제 — 주인의 뜻에 따라</p>
            <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#FDF2D4] mb-4">
              <span className="text-[#F1C66B] font-semibold">&ldquo;MASTERS REFORMED ASSEMBLY&rdquo;</span> is more than a name. It asserts an identity: a church community reformed according to the Master&apos;s will — the lordship of Christ.{' '}
              <span className="text-[#F1C66B] font-semibold">&ldquo;MRA2023&rdquo;</span> marks the year the assembly was founded. The Korean inscription,{' '}
              <span className="text-[#F1C66B] font-semibold">마스터스 개혁파 총회</span>, is its name in its native tongue.
            </p>
            <p className="text-sm md:text-[15px] leading-[1.8] text-[rgba(253,242,212,0.72)]">
              &lsquo;MASTERS REFORMED ASSEMBLY&rsquo;는 단순한 이름을 넘어, &lsquo;주인의 뜻(그리스도의 주권)에 따라 개혁된 교회 공동체&rsquo;라는 정체성을 강조합니다. &lsquo;MRA2023&rsquo;은 총회 설립일을 나타냅니다.
            </p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="mt-16 pt-10 border-t-2 border-[#E3A833] flex flex-col sm:flex-row justify-between items-baseline gap-2 text-[11px] tracking-[0.12em] uppercase font-semibold text-[#F1C66B]"
        >
          <span>Masters Reformed Assembly</span>
          <span>마스터스 개혁파 총회</span>
          <span>EST. 2023</span>
        </motion.div>

      </div>
    </div>
  )
}

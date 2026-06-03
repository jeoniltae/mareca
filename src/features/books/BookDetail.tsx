"use client";
// 리폼드북스 상세 페이지 UI — 히어로 카드, 섹션별 렌더링, Framer Motion 애니메이션

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { PostActions } from "@/features/posts/PostActions";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { BackToListLink } from "@/components/shared/BackToListLink";
import { BookTOCBar, BookTOCSidebar } from "./BookTOC";
import { useState } from "react";
import { ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookSections } from "./actions";

interface BookDetailProps {
  id: string;
  title: string;
  thumbnail_url: string | null;
  sections: BookSections;
  isAdmin: boolean;
  isAuthor: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 18 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateY.set(((e.clientX - cx) / rect.width) * 20);
    rotateX.set(-((e.clientY - cy) / rect.height) * 20);
  }
  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="shrink-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX: springX, rotateY: springY }}
        className="relative w-36 sm:w-48 aspect-2/3 rounded-xl overflow-hidden shadow-2xl"
      >
        <Image src={src} alt={alt} fill className="object-cover scale-[1.01]" unoptimized />
        {/* 광택 오버레이 */}
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
      </motion.div>
    </div>
  );
}

export function BookDetail({
  id,
  title,
  thumbnail_url,
  sections,
  isAdmin,
  isAuthor,
}: BookDetailProps) {
  const {
    book_info,
    book_intro,
    recommendation,
    table_of_contents,
    body_preview,
    author_intro,
    translator_intro,
    purchase_url,
  } = sections;

  const infoItems = [
    { label: "저자", value: book_info?.author },
    { label: "출판사", value: book_info?.publisher },
    { label: "출판일", value: book_info?.pub_date },
    {
      label: "페이지",
      value: book_info?.pages ? `${book_info.pages}p` : undefined,
    },
    { label: "ISBN", value: book_info?.isbn },
    {
      label: "가격",
      value: book_info?.price
        ? `₩${Number(book_info.price).toLocaleString()}`
        : undefined,
    },
  ].filter((item) => item.value);

  const tocSections = [
    { id: 'book-info', label: '책 정보' },
    ...(book_intro ? [{ id: 'book-intro', label: '책 소개' }] : []),
    ...(recommendation ? [{ id: 'recommendation', label: '추천사' }] : []),
    ...(table_of_contents ? [{ id: 'table-of-contents', label: '목차' }] : []),
    ...(body_preview ? [{ id: 'body-preview', label: '본문 미리보기' }] : []),
    ...(author_intro ? [{ id: 'author-intro', label: '저자 소개' }] : []),
    ...(translator_intro ? [{ id: 'translator-intro', label: '역자 소개' }] : []),
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 히어로 카드 */}
      <div id="book-info" className="bg-linear-to-b from-white to-slate-50 border-b border-slate-200 shadow-sm">
        {/* 상단 액센트 바 */}
        <div className="h-1 bg-linear-to-r from-sky-500 via-sky-400 to-indigo-400" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* 책 표지 */}
            <div className="mx-auto sm:mx-0">
              {thumbnail_url ? (
                <CoverImage src={thumbnail_url} alt={`${title} 표지`} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-36 sm:w-48 aspect-2/3 rounded-xl bg-slate-200 flex items-center justify-center shadow-xl"
                >
                  <span className="text-slate-400 text-xs">표지 없음</span>
                </motion.div>
              )}
            </div>

            {/* 책 정보 */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                  {title}
                </h1>
                {sections.book_info?.subtitle && (
                  <p className="mt-2 text-base text-sky-600 italic font-medium">{sections.book_info.subtitle}</p>
                )}
              </motion.div>

              {infoItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
                  {infoItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.2 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="bg-white rounded-lg border border-slate-100 px-3 py-2.5 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-base font-semibold text-slate-800 truncate">
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 w-full sm:w-auto"
              >
                <ShareButtons
                  title={title}
                  description={book_intro?.slice(0, 100)}
                />
                {purchase_url && (
                  <a
                    href={purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <ShoppingCart size={15} />
                    구매하기
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 섹션 탭 바 */}
      <BookTOCBar sections={tocSections} />

      {/* 섹션 콘텐츠 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_180px] lg:gap-10">
        <div className="space-y-6 min-w-0 self-start">
        {/* 책 소개 */}
        {book_intro && (
          <motion.section
            id="book-intro"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionVariants}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
          >
            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
              <span className="w-1 h-5 rounded-full bg-sky-500 shrink-0" />
              책 소개
            </h2>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {book_intro}
            </p>
          </motion.section>
        )}

        {/* 추천사 */}
        {recommendation && (
          <motion.section
            id="recommendation"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionVariants}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
          >
            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
              <span className="w-1 h-5 rounded-full bg-amber-400 shrink-0" />
              추천사
            </h2>
            <blockquote className="border-l-4 border-amber-300 pl-4 bg-amber-50/60 py-3 pr-4 rounded-r-lg">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base italic">
                {recommendation}
              </p>
            </blockquote>
          </motion.section>
        )}

        {/* 목차 */}
        {table_of_contents && <TocSection id="table-of-contents" text={table_of_contents} />}

        {/* 본문 미리보기 */}
        {body_preview && (
          <motion.section
            id="body-preview"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionVariants}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
          >
            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
              <span className="w-1 h-5 rounded-full bg-emerald-500 shrink-0" />
              본문 미리보기
            </h2>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {body_preview}
            </p>
          </motion.section>
        )}

        {/* 저자 소개 */}
        {author_intro && (
          <motion.section
            id="author-intro"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionVariants}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
          >
            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
              <span className="w-1 h-5 rounded-full bg-violet-500 shrink-0" />
              저자 소개
            </h2>
            <div className="space-y-3">
              {author_intro
                .split("\n")
                .filter((para) => para.trim())
                .map((para, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <ChevronRight
                      size={15}
                      className="mt-1.5 shrink-0 text-violet-400"
                    />
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {para.trim()}
                    </p>
                  </div>
                ))}
            </div>
          </motion.section>
        )}

        {/* 역자 소개 */}
        {translator_intro && (
          <motion.section
            id="translator-intro"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={sectionVariants}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
          >
            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
              <span className="w-1 h-5 rounded-full bg-rose-400 shrink-0" />
              역자 소개
            </h2>
            <div className="space-y-3">
              {translator_intro
                .split("\n")
                .filter((para) => para.trim())
                .map((para, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <ChevronRight
                      size={15}
                      className="mt-0.5 shrink-0 text-rose-400"
                    />
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {para.trim()}
                    </p>
                  </div>
                ))}
            </div>
          </motion.section>
        )}

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <BackToListLink
            fallbackHref="/news/books"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          />
          {(isAuthor || isAdmin) && (
            <PostActions id={id} basePath="/news/books" />
          )}
        </div>
        </div>
        <BookTOCSidebar sections={tocSections} />
        </div>
      </div>
    </div>
  );
}

function TocSection({ id, text }: { id: string; text: string }) {
  const [open, setOpen] = useState(true);
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={sectionVariants}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2.5 text-base font-bold text-slate-800">
          <span className="w-1 h-5 rounded-full bg-slate-400 shrink-0" />
          목차
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-slate-400 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-100">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-mono pt-5">
                {text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

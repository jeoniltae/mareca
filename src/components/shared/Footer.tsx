import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">
              Contact Us
            </p>
            <ul className="space-y-2 text-base leading-relaxed">
              <li>본부(제주캠프): 제주특별자치도 제주시 한림읍 금악서길 27-23, A동 서길교회</li>
              <li>서울캠프: 서울시 은평구 대서문길15-11 3층 바로선개혁교회</li>
              <li>경기캠프: 경기도 평택시 이충로100번길 46, 2층 더항기#교회</li>
              <li className="pt-2">0507-1314-0972 · FAX 050-4271-7247</li>
              <li>masters@mareca.org</li>
            </ul>
          </div>

          <div className="flex flex-col md:items-end gap-5">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.jpg" alt="마스터스개혁파총회 로고" width={65} height={65} className="rounded object-cover" />
              <span className="text-white font-semibold text-base">마스터스개혁파총회</span>
            </Link>
            <div className="text-sm text-slate-400 flex items-center gap-3">
              <Link href="/privacy" className="hover:text-white transition-colors">
                개인정보처리방침
              </Link>
              <span>|</span>
              <Link href="/no-spam" className="hover:text-white transition-colors">
                이메일무단수집거부
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-slate-500">
            © Copyright 2024. 마스터스개혁파총회 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

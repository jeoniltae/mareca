// 모달 열림 여부를 전역으로 공유하는 Zustand 스토어 (모달 노출 중 플로팅 버튼 숨김 처리용)

import { create } from 'zustand'

type ModalStore = {
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  modalOpen: false,
  setModalOpen: (open) => set({ modalOpen: open }),
}))

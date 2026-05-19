// 브라우저 Canvas API로 이미지를 webp 압축하는 클라이언트 전용 유틸

const MAX_WIDTH = 1920
const QUALITY = 0.8

export async function compressImageClient(file: File): Promise<{ blob: Blob; ext: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context 생성 실패'))

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, ext: 'webp', contentType: 'image/webp' })
          } else {
            // webp 미지원 브라우저 fallback
            resolve({ blob: file, ext: file.name.split('.').pop() ?? 'jpg', contentType: file.type })
          }
        },
        'image/webp',
        QUALITY,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('이미지 로드 실패'))
    }

    img.src = objectUrl
  })
}

import sharp from 'sharp'

const MAX_WIDTH = 1920
const QUALITY = 80

export async function compressImage(file: File): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const input = Buffer.from(arrayBuffer)

  try {
    const compressed = await sharp(input)
      .rotate() // EXIF orientation 자동 보정
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer()

    return { buffer: compressed, contentType: 'image/webp', ext: 'webp' }
  } catch {
    // Sharp 처리 실패 시 원본 그대로 업로드
    const ext = file.name.split('.').pop() ?? 'jpg'
    return { buffer: input, contentType: file.type, ext }
  }
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

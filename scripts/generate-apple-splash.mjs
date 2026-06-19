import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import path from 'path'

const OUT_DIR = path.resolve('public/images/splash')
const LOGO = path.resolve('public/images/logo.png')
const BACKGROUND_COLOR = '#ffffff'

// 주요 iPhone 화면 해상도 버킷 (세로 모드만 — 모바일 컨텐츠 열람 위주 사이트라 가로 모드는 제외)
const DEVICES = [
  { width: 375, height: 667, ratio: 2, name: 'SE/8/7/6s' },
  { width: 414, height: 736, ratio: 3, name: '8 Plus/7 Plus/6s Plus' },
  { width: 375, height: 812, ratio: 3, name: 'X/XS/11 Pro/12 mini/13 mini' },
  { width: 414, height: 896, ratio: 2, name: 'XR/11' },
  { width: 414, height: 896, ratio: 3, name: 'XS Max/11 Pro Max' },
  { width: 390, height: 844, ratio: 3, name: '12/12 Pro/13/13 Pro/14' },
  { width: 428, height: 926, ratio: 3, name: '12 Pro Max/13 Pro Max/14 Plus' },
  { width: 393, height: 852, ratio: 3, name: '14 Pro/15/15 Pro/16' },
  { width: 430, height: 932, ratio: 3, name: '14 Pro Max/15 Plus/15 Pro Max/16 Plus' },
  { width: 402, height: 874, ratio: 3, name: '16 Pro' },
  { width: 440, height: 956, ratio: 3, name: '16 Pro Max' },
]

async function generate() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const device of DEVICES) {
    const pixelWidth = device.width * device.ratio
    const pixelHeight = device.height * device.ratio
    const logoWidth = Math.round(Math.min(pixelWidth * 0.35, 480))

    const logoBuffer = await sharp(LOGO).resize({ width: logoWidth }).toBuffer()
    const logoMeta = await sharp(logoBuffer).metadata()

    const fileName = `apple-splash-${pixelWidth}x${pixelHeight}.png`

    await sharp({
      create: {
        width: pixelWidth,
        height: pixelHeight,
        channels: 4,
        background: BACKGROUND_COLOR,
      },
    })
      .composite([
        {
          input: logoBuffer,
          left: Math.round((pixelWidth - logoMeta.width) / 2),
          top: Math.round((pixelHeight - logoMeta.height) / 2),
        },
      ])
      .png()
      .toFile(path.join(OUT_DIR, fileName))

    console.log(`생성: ${fileName} (${device.name})`)
  }
}

generate()

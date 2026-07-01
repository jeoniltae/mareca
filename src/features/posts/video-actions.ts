'use server'

import { createClient } from '@/lib/supabase-server'
import { mux } from '@/lib/mux'
import { redirect } from 'next/navigation'

export type PostVideo = {
  id: string
  post_id: string | null
  mux_upload_id: string
  mux_asset_id: string | null
  mux_playback_id: string | null
  status: string
  duration: number | null
  created_at: string | null
}

export async function createMuxUploadUrl(): Promise<{ videoId: string; uploadUrl: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const upload = await mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_SITE_URL ?? '*',
    new_asset_settings: {
      playback_policy: ['public'],
    },
  })

  const { data, error } = await supabase
    .from('post_videos')
    .insert({ mux_upload_id: upload.id })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  if (!upload.url) throw new Error('Mux 업로드 URL을 가져오지 못했습니다.')

  return { videoId: data.id, uploadUrl: upload.url }
}

export async function linkVideoToPost(videoId: string, postId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('post_videos')
    .update({ post_id: postId })
    .eq('id', videoId)
  if (error) throw new Error(error.message)
}

export async function pollMuxVideoStatus(videoId: string): Promise<string> {
  const supabase = await createClient()

  const { data: video } = await supabase
    .from('post_videos')
    .select('mux_upload_id, mux_asset_id, status')
    .eq('id', videoId)
    .single()

  if (!video) throw new Error('영상 정보를 찾을 수 없습니다.')
  if (video.status === 'ready') return 'ready'
  if (video.status === 'errored') return 'errored'

  let assetId = video.mux_asset_id
  if (!assetId) {
    const upload = await mux.video.uploads.retrieve(video.mux_upload_id)
    if (!upload.asset_id) return 'waiting'
    assetId = upload.asset_id
  }

  const asset = await mux.video.assets.retrieve(assetId)
  const newStatus = asset.status === 'ready' ? 'ready'
    : asset.status === 'errored' ? 'errored'
    : 'preparing'

  const updateData: {
    mux_asset_id: string
    status: string
    mux_playback_id?: string
    duration?: number | null
  } = { mux_asset_id: assetId, status: newStatus }

  if (asset.status === 'ready' && asset.playback_ids?.[0]?.id) {
    updateData.mux_playback_id = asset.playback_ids[0].id
    updateData.duration = asset.duration ?? null
  }

  await supabase.from('post_videos').update(updateData).eq('id', videoId)
  return newStatus
}

export async function deleteMuxVideo(videoId: string): Promise<void> {
  const supabase = await createClient()

  const { data: video } = await supabase
    .from('post_videos')
    .select('mux_asset_id')
    .eq('id', videoId)
    .single()

  if (video?.mux_asset_id) {
    try {
      await mux.video.assets.delete(video.mux_asset_id)
    } catch {
      // 이미 삭제되었거나 없는 에셋이어도 DB는 정리
    }
  }

  await supabase.from('post_videos').delete().eq('id', videoId)
}

export async function getPostVideo(postId: string): Promise<PostVideo | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('post_videos')
    .select('*')
    .eq('post_id', postId)
    .maybeSingle()
  return data
}

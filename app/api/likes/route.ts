import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LIKES_FILE = path.join(process.cwd(), 'data', 'likes.json')

function ensureDataFile() {
  const dir = path.dirname(LIKES_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(LIKES_FILE)) {
    fs.writeFileSync(LIKES_FILE, '{}')
  }
}

function readLikes(): Record<string, number> {
  ensureDataFile()
  const data = fs.readFileSync(LIKES_FILE, 'utf-8')
  return JSON.parse(data)
}

function writeLikes(likes: Record<string, number>) {
  ensureDataFile()
  fs.writeFileSync(LIKES_FILE, JSON.stringify(likes, null, 2))
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  }

  const likes = readLikes()
  return NextResponse.json({ slug, count: likes[slug] ?? 0 })
}

export async function POST(request: NextRequest) {
  const { slug, action } = await request.json()
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  }

  const likes = readLikes()
  if (action === 'unlike') {
    likes[slug] = Math.max((likes[slug] ?? 0) - 1, 0)
  } else {
    likes[slug] = (likes[slug] ?? 0) + 1
  }
  writeLikes(likes)

  return NextResponse.json({ slug, count: likes[slug] })
}

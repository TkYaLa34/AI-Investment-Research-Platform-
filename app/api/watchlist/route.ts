import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/watchlist'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const watchlist = await getUserWatchlist(user.id)
    return NextResponse.json({ success: true, data: watchlist })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ticker, company_id, notes } = body || {}

    if (!ticker || typeof ticker !== 'string') {
      return NextResponse.json({ error: 'Missing required field "ticker"' }, { status: 400 })
    }

    const newRecord = await addToWatchlist(user.id, ticker, company_id, notes)
    return NextResponse.json({ success: true, data: newRecord })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to add item to watchlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing required query param "id"' }, { status: 400 })
    }

    const success = await removeFromWatchlist(user.id, id)
    return NextResponse.json({ success })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to remove item from watchlist' },
      { status: 500 }
    )
  }
}

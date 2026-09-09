import { createClient } from '@/lib/supabase/server'
import type { Watchlist, Company, Stock, Database } from '@/types/database'

export type WatchlistItemWithDetails = Watchlist & {
  company?: Company | null
  stock?: Stock | null
}

export async function getUserWatchlist(userId: string): Promise<WatchlistItemWithDetails[]> {
  const supabase = await createClient()

  // Fetch watchlist records for user
  const { data: watchlists, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error || !watchlists) {
    console.error('Error fetching watchlist:', error)
    return []
  }

  // Fetch all companies & stocks for details matching
  const { data: companies } = await supabase.from('companies').select('*')
  const { data: stocks } = await supabase.from('stocks').select('*')

  const companiesById = new Map<string, Company>()
  const companiesByTicker = new Map<string, Company>()
  if (companies) {
    companies.forEach((c: Company) => {
      companiesById.set(c.id, c)
      companiesByTicker.set(c.ticker.toUpperCase(), c)
    })
  }

  const stocksByCompanyId = new Map<string, Stock>()
  const stocksByTicker = new Map<string, Stock>()
  if (stocks) {
    stocks.forEach((s: Stock) => {
      if (s.company_id) stocksByCompanyId.set(s.company_id, s)
      if (s.ticker) stocksByTicker.set(s.ticker.toUpperCase(), s)
    })
  }

  return (watchlists as Watchlist[]).map((item) => {
    const company =
      (item.company_id ? companiesById.get(item.company_id) : null) ||
      companiesByTicker.get(item.ticker.toUpperCase()) ||
      null

    const stock =
      (company?.id ? stocksByCompanyId.get(company.id) : null) ||
      stocksByTicker.get(item.ticker.toUpperCase()) ||
      null

    return {
      ...item,
      company,
      stock,
    }
  })
}

export async function addToWatchlist(
  userId: string,
  ticker: string,
  companyId?: string | null,
  notes?: string | null
): Promise<Watchlist> {
  const supabase = await createClient()

  const insertPayload: Database['public']['Tables']['watchlists']['Insert'] = {
    user_id: userId,
    ticker: ticker.toUpperCase(),
    company_id: companyId || null,
    notes: notes || null,
  }

  const { data, error } = await supabase
    .from('watchlists')
    .insert(insertPayload as any)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(`Failed to add ${ticker} to watchlist: ${error?.message}`)
  }

  return data as Watchlist
}

export async function removeFromWatchlist(userId: string, watchlistId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('watchlists')
    .delete()
    .eq('id', watchlistId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error removing from watchlist:', error)
    return false
  }

  return true
}

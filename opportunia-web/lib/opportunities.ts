import rawData from '@/data/opportunities.json'
import type { Opportunity } from '@/types'
import { getOpportunityImage } from './utils'

const rawList: Opportunity[] = Array.isArray(rawData)
  ? (rawData as Opportunity[])
  : (rawData as { opportunities: Opportunity[] }).opportunities || []

export const ALL_OPPORTUNITIES: Opportunity[] = rawList.map((opp) => ({
  ...opp,
  image: getOpportunityImage(opp),
}))

export function getOpportunityById(id: string): Opportunity | undefined {
  return ALL_OPPORTUNITIES.find((o) => o.id === id)
}

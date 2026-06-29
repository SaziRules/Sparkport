export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export function calculateTier(totalPoints: number): RewardTier {
  if (totalPoints >= 5000) return 'platinum'
  if (totalPoints >= 2000) return 'gold'
  if (totalPoints >= 500) return 'silver'
  return 'bronze'
}

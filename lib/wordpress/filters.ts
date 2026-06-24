const PROMOTIONAL_KEYWORDS = [
  'sale', 'special', 'specials', 'promo', 'promotion', 'promotions',
  'deal', 'deals', 'offer', 'offers', 'discount', 'clearance', 'flash',
  'ramadan', 'eid', 'christmas', 'easter', 'diwali', 'festive',
  'holiday', 'seasonal', 'spring', 'summer', 'autumn', 'winter',
  'black-friday', 'cyber', 'valentines', 'mothers-day', 'fathers-day', 'back-to-school', 'new-year', 'thanksgiving', 'halloween', 'independence-day', 'day', 'memorial-day', 'labor-day', 'veterans-day', 'presidents-day', 'columbus-day', 'martin-luther-king-day', 'juneteenth', 'earth-day', 'st-patricks-day', 'carnival', 'mardi-gras', 'hanukkah', 'kwanzaa'
];

export function isPromotionalCategory(slug: string): boolean {
  const lower = slug.toLowerCase();
  return PROMOTIONAL_KEYWORDS.some(kw => lower.includes(kw));
}

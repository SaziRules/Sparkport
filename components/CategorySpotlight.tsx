import { getProductCategories, getProducts, isPromotionalCategory } from '@/lib/wordpress';
import CategorySpotlightTabs from './CategorySpotlightTabs';

export default async function CategorySpotlight() {
  const categories = await getProductCategories();

  const topCats = categories
    .filter(c => c.slug !== 'uncategorized' && !isPromotionalCategory(c.slug))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const spotlights = await Promise.all(
    topCats.map(async (cat) => {
      const products = await getProducts({ category: cat.id, per_page: 6 });
      return { category: cat, products };
    })
  );

  const populated = spotlights.filter(s => s.products.length > 0);
  if (populated.length === 0) return null;

  return <CategorySpotlightTabs spotlights={populated} />;
}

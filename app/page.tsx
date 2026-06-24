import BlogPreview from "@/components/BlogPreview";
import CategorySpotlight from "@/components/CategorySpotlight";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroSection from "@/components/HeroSection";
import ImageBanner from "@/components/ImageBanner";
import PromotionalBanners from "@/components/PromotionalBanners";
import ServicesShowcase from "@/components/ServicesShowcase";
import SurgicalProducts from "@/components/SurgicalProducts";
import ValuePropositionStrip from "@/components/ValuePropositionStrip";
import { getPosts } from "@/lib/wordpress";

export default async function Home() {
  const blogPosts = await getPosts({ per_page: 4 });

  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <ImageBanner
        image="https://sparkport.co.za/wp-content/uploads/sparkport-web-banner.png"
        link="/product-category/brain-boosters"
        alt="Surgical Supplies Banner"
        height="h-[300px] lg:h-[400px]"
      />
      <ValuePropositionStrip />
      <ServicesShowcase />
      <CategorySpotlight />
      <PromotionalBanners />
      <SurgicalProducts />
      <BlogPreview posts={blogPosts} />
    </main>
  );
}

import { notFound } from 'next/navigation';
import ArticleContent from '@/components/ArticleContent';

// This will be replaced with WordPress API call later
const BLOG_POSTS = [
  {
    id: '1',
    title: 'World Cancer Day: Understanding Prevention and Early Detection',
    content: `
      <p>Cancer remains one of the most significant health challenges worldwide. On this World Cancer Day, we focus on the importance of prevention and early detection in the fight against cancer.</p>
      
      <h2>Understanding Cancer Prevention</h2>
      <p>Prevention is always better than cure. Research shows that up to 50% of cancers can be prevented through lifestyle modifications and regular screening.</p>
      
      <h3>Key Prevention Strategies</h3>
      <ul>
        <li>Maintain a healthy diet rich in fruits and vegetables</li>
        <li>Exercise regularly - at least 30 minutes daily</li>
        <li>Avoid tobacco and limit alcohol consumption</li>
        <li>Protect your skin from excessive sun exposure</li>
        <li>Get vaccinated against HPV and Hepatitis B</li>
      </ul>
      
      <h2>The Importance of Early Detection</h2>
      <p>Early detection significantly increases the chances of successful treatment. Regular screenings can detect cancer before symptoms appear.</p>
      
      <h3>Recommended Screenings</h3>
      <p>Different types of cancer require different screening approaches. Consult with your healthcare provider about:</p>
      <ul>
        <li>Mammograms for breast cancer</li>
        <li>Colonoscopy for colorectal cancer</li>
        <li>PAP smears for cervical cancer</li>
        <li>PSA tests for prostate cancer</li>
      </ul>
      
      <h2>Supporting Those Affected</h2>
      <p>Supporting cancer patients and survivors is crucial. Whether through emotional support, practical help, or raising awareness, every action counts.</p>
    `,
    excerpt: 'Join us in raising awareness and supporting those affected by cancer on this important day.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    date: '04 FEB 2024',
    author: {
      name: 'Dr. Sarah Mitchell',
      title: 'Chief Pharmacist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    },
    categories: ['Pharmacy & Healthcare', 'Wellness'],
    tags: ['Cancer Awareness', 'Prevention', 'Health Screening', 'Wellness'],
    slug: 'world-cancer-day',
    readTime: '8 min read',
    relatedProducts: [
      {
        name: 'Vitamin D3 Supplements',
        description: 'Support your immune system with high-quality Vitamin D3',
        price: 'R 129.99',
        image: 'https://images.unsplash.com/photo-1550572017-4764382df5e7?w=400&q=80',
        link: '/products/vitamin-d3',
      },
    ],
  },
  {
    id: '2',
    title: 'Pregnancy Awareness Week',
    content: '<p>Pregnancy content...</p>',
    excerpt: 'Everything you need to know about staying healthy during pregnancy.',
    image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=1200&q=80',
    date: '04 FEB 2024',
    author: {
      name: 'Dr. Emily Chen',
      title: 'Women\'s Health Specialist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    },
    categories: ['Pharmacy & Healthcare'],
    tags: ['Pregnancy', 'Prenatal Care', 'Women\'s Health'],
    slug: 'pregnancy-awareness-week',
    readTime: '6 min read',
    relatedProducts: [],
  },
];

function getPost(slug: string) {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return <ArticleContent post={post} />;
}
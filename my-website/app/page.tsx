import Link from 'next/link';
import Hero from './components/Hero';
import { ValueCardImage } from './components/ValueCard';
import FeaturedProducts from './components/FeaturedProducts';
import DisclaimerBanner from './components/DisclaimerBanner';

// Categories for the homepage
const categories = [
  { id: 'fish', name: 'Fish', icon: '🐟' },
  { id: 'prawns', name: 'Prawns', icon: '🦐' },
  { id: 'chicken', name: 'Chicken', icon: '🍗' },
  { id: 'mutton', name: 'Mutton', icon: '🥩' },
  { id: 'seafood', name: 'Seafood', icon: '🦀' },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Premium Quality Meat & Seafood, Delivered Fresh"
        subtitle="Sustainably sourced, expertly selected, traceable from farm to table. Experience the difference of farm-to-door freshness."
        primaryCta={{ text: 'Shop Now', href: '/shop' }}
        secondaryCta={{ text: 'Learn Our Story', href: '/our-story' }}
        size="large"
      />

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* The JHOM FOODS Difference */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
              THE JHOM FOODS DIFFERENCE
            </span>
            <h2
              className="text-3xl lg:text-5xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <ValueCardImage
              image="🌾"
              title="Sustainably sourced and fully traceable"
              description="We partner with small, independent farms and fisheries that share our values for animal welfare and environmental stewardship."
            />
            <ValueCardImage
              image="👨‍🍳"
              title="Hand-selected by experts"
              description="Our team works with regional farmers and craft butchers who focus on doing things the right way. Every product is chosen with care."
            />
            <ValueCardImage
              image="✨"
              title="Premium flavor, every time"
              description="From rich marbling to exceptional tenderness, each cut is chosen for the taste that makes every meal extraordinary."
            />
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl text-center">
              Explore our wide range of premium quality products
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.name}`}
                className="group bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
                FEATURED PRODUCTS
              </span>
              <h2
                className="text-3xl lg:text-4xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Customer Favorites
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 group"
            >
              View All Products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Products from API */}
          <FeaturedProducts />

          <div className="mt-10 text-center md:hidden">
            <Link href="/shop" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section bg-gradient-to-br from-cyan-50 to-cyan-100/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-cyan-200 text-cyan-800 rounded-full text-sm font-semibold mb-6">
              OUR MISSION
            </span>
            <blockquote
              className="text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              &ldquo;Our mission is to create an alternative to the current meat commodity system, and to create a meaningful connection between the farmer and the customer, so people can know and appreciate exactly where their food comes from.&rdquo;
            </blockquote>
            <Link
              href="/our-story"
              className="inline-flex items-center gap-2 text-cyan-700 font-semibold text-lg hover:text-cyan-800 group"
            >
              Learn More About Us
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="section bg-white overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
                QUALITY PROMISE
              </span>
              <h2
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Quality you can taste
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  'From free-range organic chicken to pasture-raised goats',
                  'We handpick and taste-test every product',
                  'Only the best reaches your table',
                  "It's good food you can feel good about — simple, sustainable and 100% delicious",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="h-6 w-6 text-cyan-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/quality" className="btn btn-primary">
                Learn About Our Quality
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 aspect-square">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[120px]">🍖</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-100 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Strip */}
      <section className="py-12 bg-gray-50 border-y">
        <div className="container">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-700">
              Certified Quality You Can Trust
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {['USDA Organic', 'Non-GMO', 'Humane Certified', 'FSSAI', 'ISO Certified'].map(
              (cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 text-gray-500 hover:text-cyan-600 transition-colors"
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="font-medium">{cert}</span>
                </div>
              )
            )}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/certifications"
              className="text-cyan-600 font-semibold hover:text-cyan-700"
            >
              View All Certifications →
            </Link>
          </div>
        </div>
      </section>

      {/* App Download CTA */}
      <section className="section bg-black">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Light blue card with blue text */}
            <div className="bg-sky-50 rounded-2xl p-8 lg:p-12 text-center mb-8">
              <h2
                className="text-3xl lg:text-5xl font-bold mb-4 text-sky-600"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Shop Fresh. Shop Easy.
              </h2>
              <p className="text-lg lg:text-xl text-sky-600">
                Download our app for exclusive deals, faster checkout, and seamless ordering experience.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* App Store Button */}
              <a
                href="#"
                className="flex items-center gap-4 px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors shadow-lg border border-gray-700"
              >
                {/* Apple Icon */}
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-white">Download on</div>
                  <div className="font-bold text-white">App Store</div>
                </div>
              </a>
              {/* Google Play Button */}
              <a
                href="#"
                className="flex items-center gap-4 px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors shadow-lg border border-gray-700"
              >
                {/* Play Store Icon */}
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-white">Download on</div>
                  <div className="font-bold text-white">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Orders CTA */}
      <section className="section bg-black">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Light blue card with blue text */}
            <div className="bg-sky-50 rounded-2xl p-8 lg:p-12 text-center">
              <h2
                className="text-2xl lg:text-4xl font-bold mb-4 text-sky-600"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Looking for Bulk Orders?
              </h2>
              <p className="text-sky-600 text-lg mb-8">
                Special pricing for restaurants, hotels, and catering services.
              </p>
              <Link
                href="/bulk-orders"
                className="btn btn-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow-lg"
              >
                Get Bulk Pricing
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


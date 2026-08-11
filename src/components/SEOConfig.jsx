import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * SEOConfig Component
 * Dynamic route-aware SEO metadata manager using react-helmet-async
 */
export default function SEOConfig({
  title = "پورتفولیو و نمونه کارهای برنامه نویسی | behrad Profile",
  description = "پورتفولیو شخصی، ارائه دهنده نمونه کارها، مقالات تخصصی برنامه‌نویسی و وب، مهارت‌ها و خدمات طراحی وبسایت.",
  keywords = "برنامه‌نویسی, طراحی وب, ری‌اکت, فرانت‌اند, پورتفولیو, React, Web Development",
  ogTitle,
  ogDescription,
  ogImage = "/logo192.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  robots,
  noIndex = false,
  canonical,
  author = "behrad",
  schema,
}) {
  const location = useLocation();

  // Dynamic origin calculation safely handling SSR/browser environment
  const origin = typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "";

  // Dynamic canonical URL based on current router location
  const currentCanonical = canonical
    ? (canonical.startsWith("http") ? canonical : `${origin}${canonical}`)
    : `${origin}${location.pathname}`;

  // Formatted page title
  const formattedTitle = title.includes("behrad") || title.includes("پورتفولیو")
    ? title
    : `${title} | behrad Profile`;

  const metaDescription = description;
  const currentOgTitle = ogTitle || formattedTitle;
  const currentOgDesc = ogDescription || metaDescription;

  // Resolve absolute image URL if relative path provided
  const absoluteOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${origin}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

  // Robots instruction determination
  const robotsInstruction = noIndex || location.pathname === "/404"
    ? "noindex, nofollow"
    : (robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

  return (
    <Helmet>
      {/* Primary HTML & Standard Meta Tags */}
      <html lang="fa" dir="rtl" />
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && (
        <meta
          name="keywords"
          content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
        />
      )}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsInstruction} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Dynamic Canonical URL */}
      {currentCanonical && <link rel="canonical" href={currentCanonical} />}

      {/* Open Graph / Social Media Cards */}
      <meta property="og:site_name" content="behrad Profile" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={currentOgTitle} />
      <meta property="og:description" content={currentOgDesc} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:url" content={currentCanonical} />
      <meta property="og:locale" content="fa_IR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={currentOgTitle} />
      <meta name="twitter:description" content={currentOgDesc} />
      <meta name="twitter:image" content={absoluteOgImage} />

      {/* Optional JSON-LD Structured Data Schema for Search Engines */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

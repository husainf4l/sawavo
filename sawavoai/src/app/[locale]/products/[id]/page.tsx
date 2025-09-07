import { productsService } from "@/services/productsService";
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

// Generate metadata for better SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;

  try {
    // Try to fetch by slug first, then by ID for backward compatibility
    let product = await productsService.getProductBySlug(id);
    if (!product) {
      product = await productsService.getProductById(id);
    }

    if (!product) {
      return {
        title: "Product Not Found | Sawavo",
        description: "The requested product could not be found.",
      };
    }

    const isRTL = locale === "ar";
    const productName = isRTL ? product.titleAr : product.title;
    const productDescription = isRTL
      ? product.descriptionAr
      : product.descriptionEn;
    const brandName = isRTL ? product.brand?.nameAr : product.brand?.name;
    const categoryName = isRTL
      ? product.category?.nameAr
      : product.category?.name;

    const title = `${productName}${
      brandName ? ` | ${brandName}` : ""
    } | Sawavo`;
    const description =
      productDescription ||
      `${productName} - Premium skincare product from Sawavo`;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://Sawavo.com";
    // Use slug for SEO-friendly URLs in metadata
    const productUrl = `${baseUrl}/${locale}/products/${product.slug}`;
    const productImage =
      product.images?.[0]?.url || `${baseUrl}/product-holder.webp`;

    return {
      title,
      description,
      keywords: [
        productName,
        brandName,
        categoryName,
        "skincare",
        "beauty",
        ...(product.concerns || []),
      ]
        .filter(Boolean)
        .join(", "),

      metadataBase: new URL(baseUrl),

      openGraph: {
        title: productName,
        description,
        url: productUrl,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
        type: "website",
        locale: locale === "ar" ? "ar_SA" : "en_US",
        siteName: "Sawavo",
      },

      twitter: {
        card: "summary_large_image",
        title: productName,
        description,
        images: [productImage],
        site: "@Sawavo",
      },

      alternates: {
        canonical: productUrl,
        languages: {
          en: `${baseUrl}/en/products/${product.slug}`,
          ar: `${baseUrl}/ar/products/${product.slug}`,
        },
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      other: {
        "product:price:amount": product.price?.toString() || "0",
        "product:price:currency": "JOD",
        "product:availability": product.isInStock ? "in stock" : "out of stock",
        "product:brand": brandName || "Sawavo",
        "product:category": categoryName || "Skincare",
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Product | Sawavo",
      description: "Premium skincare products from Sawavo",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductPageClient params={params} />;
}

"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  startTransition,
} from "react";

const HeroSection = () => {
  const locale = useLocale();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isRTL = locale === "ar";

  // Detect mobile device for optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoize hero images with mobile prioritization
  const heroImages = useMemo(
    () => ["/hero/hero1.webp", "/hero/hero2.webp"],
    []
  );

  // Memoize scroll handler to prevent recreating function
  const handleScrollToNext = useCallback(() => {
    const nextSection =
      document.querySelector("#features") ||
      document.querySelector("section:nth-of-type(2)") ||
      document.querySelector("main > *:nth-child(2)");
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback: scroll by viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle navigation to shop page
  const handleGetAnalysis = useCallback(() => {
    router.push(`/${locale}/shop`);
  }, [router, locale]);

  // Optimized mouse move handler - disabled on mobile for performance
  useEffect(() => {
    if (!isLoaded || isMobile) return; // Skip on mobile for better performance

    let timeoutId: NodeJS.Timeout;
    let isThrottled = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (isThrottled) return;

      isThrottled = true;

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        startTransition(() => {
          setMousePosition({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
          });
        });

        // Reset throttle after a frame
        timeoutId = setTimeout(() => {
          isThrottled = false;
        }, 32); // ~30fps to reduce CPU usage
      });
    };

    // Delay mouse move listener to not interfere with LCP and FCP
    const loadTimeoutId = setTimeout(() => {
      // Only add if user is actively interacting (reduce idle CPU usage)
      let hasInteracted = false;

      const initMouseTracking = () => {
        if (!hasInteracted) {
          hasInteracted = true;
          window.addEventListener("mousemove", handleMouseMove, {
            passive: true,
            capture: false,
          });
          // Remove the init listeners
          window.removeEventListener("click", initMouseTracking);
          window.removeEventListener("scroll", initMouseTracking);
        }
      };

      // Only start tracking after user interaction
      window.addEventListener("click", initMouseTracking, { once: true });
      window.addEventListener("scroll", initMouseTracking, { once: true });
    }, 5000); // Wait 5 seconds after component load

    return () => {
      clearTimeout(loadTimeoutId);
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isLoaded, isMobile]);

  // Mark as loaded after mount to enable interactions
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Optimized image carousel - longer intervals on mobile
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(
      () => {
        startTransition(() => {
          setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % heroImages.length
          );
        });
      },
      isMobile ? 8000 : 6000
    ); // Longer intervals on mobile for better performance

    return () => clearInterval(interval);
  }, [heroImages.length, isLoaded, isMobile]);

  return (
    <section
      className={`hero-section relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white ${
        isRTL ? "rtl font-cairo" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Optimized Background - Marketing Focused */}
      {isLoaded && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-white to-pink-50/30 will-change-transform"
            style={{
              transform: `translate3d(${mousePosition.x * 0.01}px, ${
                mousePosition.y * 0.01
              }px, 0)`,
            }}
          />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-100/20 to-transparent transform -skew-y-12"></div>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center ${
            isRTL ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Text Content */}
          <div
            className={`space-y-8 ${
              isRTL
                ? "lg:order-2 text-center lg:text-right"
                : "order-2 lg:order-1 text-center lg:text-left"
            }`}
          >
            {/* Compelling Marketing Badge */}
            <div className="opacity-100 animate-fade-in">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 rounded-full text-sm font-semibold shadow-sm ${
                  isRTL ? "flex-row-reverse font-cairo" : ""
                }`}
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-sm" />
                <span className="tracking-wide">
                  {isRTL
                    ? "اكتشاف جديد: نتائج مضمونة في 30 يوم"
                    : "New Discovery: Guaranteed Results in 30 Days"}
                </span>
                <svg
                  className="w-4 h-4 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Main Headline - Marketing Focused */}
            <div className="space-y-6">
              <h1
                className={`${
                  isRTL
                    ? "text-5xl lg:text-7xl font-cairo font-extralight text-gray-900 leading-[1.1] tracking-wide"
                    : "text-5xl lg:text-7xl font-extralight text-gray-900 leading-[1.1] tracking-tight"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="block mb-2 text-gray-800">
                      احصلي على بشرة
                    </span>
                    <span className="block text-rose-600 font-normal">
                      مثالية في 30 يوم
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block mb-2 text-gray-800">
                      Get Perfect Skin
                    </span>
                    <span className="block text-rose-600 font-normal">
                      in Just 30 Days
                    </span>
                  </>
                )}
              </h1>

              <p
                className={`text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light ${
                  isRTL ? "font-cairo mx-auto lg:mx-0" : "mx-auto lg:mx-0"
                }`}
              >
                {isRTL
                  ? "اكتشفي سر البشرة المشرقة مع منتجاتنا الطبيعية 100%. نتائج سريعة، آمنة، ومضمونة مع استرداد أموالك في 60 يوم"
                  : "Discover the secret to radiant skin with our 100% natural products. Fast, safe, and guaranteed results with 60-day money-back promise"}
              </p>
            </div>

            {/* Marketing-Focused CTAs */}
            <div className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleGetAnalysis}
                  className={`bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl shadow-lg hover:scale-105 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {isRTL ? "ابدأي رحلتك الآن" : "Start Your Journey"}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  onClick={() => router.push(`/${locale}/products`)}
                  className={`bg-white border-2 border-rose-200 hover:border-rose-300 text-rose-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:bg-rose-50 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "استكشفي المنتجات" : "Explore Products"}
                </button>
              </div>

              {/* Urgency & Social Proof */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-rose-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        +
                      </div>
                    </div>
                    <div>
                      <div
                        className={`text-sm font-semibold text-gray-900 ${
                          isRTL ? "font-cairo" : ""
                        }`}
                      >
                        {isRTL
                          ? "انضمي لأكثر من 10,000 عميل راضي"
                          : "Join 10,000+ Happy Customers"}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          4.9/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                      >
                        {isRTL ? "ضمان 60 يوم" : "60-Day Guarantee"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`font-medium ${isRTL ? "font-cairo" : ""}`}
                      >
                        {isRTL ? "توصيل مجاني" : "Free Shipping"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 border-t border-gray-200">
              <div
                className={`text-center group ${
                  isRTL ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <svg
                      className="w-8 h-8 text-rose-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  98%
                </div>
                <div
                  className={`text-sm text-gray-600 font-semibold uppercase tracking-wide ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "رضا العملاء" : "Customer Satisfaction"}
                </div>
              </div>
              <div
                className={`text-center group ${
                  isRTL ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  25K+
                </div>
                <div
                  className={`text-sm text-gray-600 font-semibold uppercase tracking-wide ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "منتج مباع" : "Products Sold"}
                </div>
              </div>
              <div
                className={`text-center group ${
                  isRTL ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <svg
                      className="w-8 h-8 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-1">
                  4.9
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div
                  className={`text-sm text-gray-600 font-semibold uppercase tracking-wide ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "تقييم المنتجات" : "Product Rating"}
                </div>
              </div>
            </div>
          </div>

          {/* Optimized Image Section */}
          <div
            className={`relative ${
              isRTL ? "lg:order-1" : "order-1 lg:order-2"
            }`}
          >
            <div className="relative aspect-[3/4] max-w-sm lg:max-w-md mx-auto">
              {/* Clean Image Container with performance optimizations */}
              <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 bg-white will-change-contents">
                {/* Primary hero image - mobile-optimized for Speed Index */}
                <Image
                  src={heroImages[0]}
                  alt={
                    isRTL
                      ? "تحليل احترافي للبشرة"
                      : "Professional skin analysis"
                  }
                  fill
                  className="object-cover object-center transition-opacity duration-500"
                  priority
                  loading="eager"
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 40vw, 35vw"
                  quality={85} // Optimized quality for LCP
                  fetchPriority="high"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />

                {/* Secondary images - loaded with lower priority */}
                {isLoaded &&
                  heroImages.slice(1).map((imageSrc, index) => (
                    <Image
                      key={imageSrc}
                      src={imageSrc}
                      alt={
                        isRTL
                          ? "تحليل احترافي للبشرة"
                          : "Professional skin analysis"
                      }
                      fill
                      className={`object-cover object-center transition-opacity duration-500 ${
                        index + 1 === currentImageIndex
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0"
                      }`}
                      loading="lazy"
                      sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      quality={isMobile ? 60 : 70} // Lower quality for secondary images
                      fetchPriority="low"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  ))}

                {/* Subtle overlay - only render if loaded */}
                {isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-20" />
                )}
              </div>

              {/* Optimized floating indicator */}
              <div
                className={`absolute top-4 lg:top-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-full shadow-lg z-30 ${
                  isRTL
                    ? "right-4 lg:right-6 flex-row-reverse"
                    : "left-4 lg:left-6"
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span
                  className={`text-xs font-medium text-gray-800 ${
                    isRTL ? "font-cairo" : ""
                  }`}
                >
                  {isRTL ? "أفضل مبيعات" : "Best Seller"}
                </span>
              </div>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center ${
                      index === currentImageIndex
                        ? "bg-white/90 shadow-md"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-gray-900"
                          : "bg-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <button
        onClick={handleScrollToNext}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-40 hover:opacity-80 focus:outline-none group"
        aria-label={isRTL ? "انتقل للأسفل" : "Scroll down"}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gray-300 group-hover:bg-gray-400" />
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
    </section>
  );
};

export default HeroSection;

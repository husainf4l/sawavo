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
  const [isMounted, setIsMounted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isRTL = locale === "ar";

  // Ensure component is mounted to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect mobile device for optimizations
  useEffect(() => {
    if (!isMounted) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      try {
        window.removeEventListener("resize", handleResize);
      } catch (error) {
        console.warn("Resize listener cleanup warning:", error);
      }
    };
  }, [isMounted]);

  // Memoize hero images with mobile prioritization
  const heroImages = useMemo(
    () => ["/hero/hero1.webp", "/hero/hero2.webp"],
    []
  );

  // Memoize scroll handler to prevent recreating function
  const handleScrollToNext = useCallback(() => {
    if (!isMounted) return;

    try {
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
    } catch (error) {
      console.warn("Scroll operation warning:", error);
    }
  }, [isMounted]);

  // Handle navigation to shop page
  const handleGetAnalysis = useCallback(() => {
    if (!isMounted) return;

    try {
      router.push(`/${locale}/shop`);
    } catch (error) {
      console.warn("Navigation warning:", error);
    }
  }, [router, locale, isMounted]);

  // Optimized mouse move handler - disabled on mobile for performance
  useEffect(() => {
    if (!isMounted || !isLoaded || isMobile) return; // Skip on mobile for better performance

    let timeoutId: NodeJS.Timeout;
    let loadTimeoutId: NodeJS.Timeout;
    let isThrottled = false;
    let hasInteracted = false;

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

    const initMouseTracking = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        window.addEventListener("mousemove", handleMouseMove, {
          passive: true,
          capture: false,
        });
      }
    };

    const handleClick = () => {
      initMouseTracking();
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };

    const handleScroll = () => {
      initMouseTracking();
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };

    // Delay mouse move listener to not interfere with LCP and FCP
    loadTimeoutId = setTimeout(() => {
      // Only start tracking after user interaction
      window.addEventListener("click", handleClick, { once: true });
      window.addEventListener("scroll", handleScroll, { once: true });
    }, 5000); // Wait 5 seconds after component load

    return () => {
      clearTimeout(loadTimeoutId);
      clearTimeout(timeoutId);
      // Safe cleanup - check if listeners exist before removing
      try {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("scroll", handleScroll);
      } catch (error) {
        // Silently catch any cleanup errors
        console.warn("Event listener cleanup warning:", error);
      }
    };
  }, [isMounted, isLoaded, isMobile]);

  // Mark as loaded after mount to enable interactions
  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted]);

  // Optimized image carousel - longer intervals on mobile
  useEffect(() => {
    if (!isMounted || !isLoaded) return;

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

    return () => {
      clearInterval(interval);
    };
  }, [heroImages.length, isMounted, isLoaded, isMobile]);

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) {
    return (
      <section
        className={`hero-section relative h-[80vh] flex items-center justify-center overflow-hidden ${
          isRTL ? "rtl font-cairo" : "ltr"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Static content for SSR */}
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="opacity-100 mb-16">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-full text-sm font-medium shadow-lg ${
                  isRTL ? "flex-row-reverse font-cairo" : ""
                }`}
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <span className="tracking-wider font-medium">
                  {isRTL
                    ? "150+ علامة جمال عالمية • 25,000+ منتج جمال • توصيل سريع"
                    : "150+ Global Beauty Brands • 25,000+ Beauty Products • Fast Delivery"}
                </span>
              </div>
            </div>

            <div className="space-y-8 mb-16">
              <h1
                className={`${
                  isRTL
                    ? "text-5xl lg:text-7xl font-cairo font-light text-slate-800 leading-[1.1] tracking-tight"
                    : "text-5xl lg:text-7xl font-light text-slate-800 leading-[1.1] tracking-tight"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="block mb-6 text-slate-600 font-extralight">
                      الجمال
                    </span>
                    <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text text-transparent font-medium">
                      في أرقى أشكاله
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block mb-6 text-slate-600 font-extralight">
                      Beauty
                    </span>
                    <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text text-transparent font-medium">
                      Elevated
                    </span>
                  </>
                )}
              </h1>

              <p
                className={`text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "منصة الجمال الرائدة في المنطقة، نقدم لك أحدث المنتجات من أشهر العلامات التجارية العالمية مع خدمة استشارية متخصصة وتوصيل سريع"
                  : "The region's premier beauty destination, featuring the latest products from world-renowned brands with expert consultation and lightning-fast delivery"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button
                className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 px-12 py-5 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "اكتشفي المجموعة المميزة"
                  : "Explore Premium Collection"}
              </button>

              <button
                className={`bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-12 py-5 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "تسوقي الآن" : "Shop Now"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`hero-section relative min-h-[90vh] flex items-center justify-center overflow-hidden ${
        isRTL ? "rtl font-cairo" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Content Container - Centered */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Professional Badge */}
            <div className="mb-8">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-full text-sm font-medium shadow-lg ${
                  isRTL ? "flex-row-reverse font-cairo" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 bg-rose-500 rounded-full ${
                    isLoaded ? "animate-pulse" : ""
                  }`}
                />
                <span className="tracking-wide font-medium">
                  {isRTL
                    ? "150+ علامة جمال عالمية • 25,000+ منتج جمال"
                    : "150+ Global Beauty Brands • 25,000+ Beauty Products"}
                </span>
              </div>
            </div>

            {/* Professional Headline */}
            <div className="space-y-6 mb-8">
              <h1
                className={`${
                  isRTL
                    ? "text-4xl lg:text-6xl font-cairo font-light text-gray-900 leading-[1.1] tracking-tight"
                    : "text-4xl lg:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="block mb-4 text-gray-600 font-extralight">
                      اكتشفي
                    </span>
                    <span className="block bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent font-medium">
                      جمالك الحقيقي
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block mb-4 text-gray-600 font-extralight">
                      Discover
                    </span>
                    <span className="block bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent font-medium">
                      Your True Beauty
                    </span>
                  </>
                )}
              </h1>

              <p
                className={`text-lg text-gray-600 leading-relaxed font-light ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL
                  ? "منصة الجمال الرائدة في المنطقة - منتجات مكياج، عناية بالبشرة، عطور، وأكثر من 150 علامة تجارية عالمية"
                  : "The region's premier beauty destination - makeup, skincare, fragrances, and more from 150+ global brands"}
              </p>
            </div>

            {/* Professional CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={handleGetAnalysis}
                className={`bg-rose-600 text-white hover:bg-rose-700 px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "اكتشفي المنتجات" : "Explore Products"}
              </button>

              <button
                onClick={() => router.push(`/${locale}/products`)}
                className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${
                  isRTL ? "font-cairo" : ""
                }`}
              >
                {isRTL ? "تسوقي الآن" : "Shop Now"}
              </button>
            </div>

            {/* Professional Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 lg:gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className={`font-medium ${isRTL ? "font-cairo" : ""}`}>
                  {isRTL ? "منتجات أصلية" : "100% Authentic"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className={`font-medium ${isRTL ? "font-cairo" : ""}`}>
                  {isRTL ? "توصيل سريع" : "Fast Delivery"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className={`font-medium ${isRTL ? "font-cairo" : ""}`}>
                  {isRTL ? "استشارة مجانية" : "Free Consultation"}
                </span>
              </div>
            </div>
          </div>

          {/* Video Content */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-full max-w-[600px] h-[50vh] max-h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/30">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                poster="/hero/hero1.webp"
                style={{
                  display: isMobile || videoError ? "none" : "block",
                }}
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => setVideoError(true)}
              >
                <source src="/hero/Works.webm" type="video/webm" />
              </video>

              {/* Fallback image for mobile and video errors */}
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl"
                style={{
                  backgroundImage: "url('/hero/hero1.webp')",
                  display: isMobile || videoError ? "block" : "none",
                }}
              />

              {/* Professional video overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Scroll Indicator */}
      <button
        onClick={handleScrollToNext}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-60 hover:opacity-100 focus:outline-none group transition-all duration-200"
        aria-label={isRTL ? "انتقل للأسفل" : "Scroll down"}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gray-300 group-hover:bg-gray-400 transition-colors duration-200" />
          <div className="w-5 h-5 rounded-full border border-gray-300 group-hover:border-gray-400 bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-sm">
            <svg
              className="w-2.5 h-2.5 text-gray-500 group-hover:text-gray-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </button>
    </section>
  );
};

export default HeroSection;

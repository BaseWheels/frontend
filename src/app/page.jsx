"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";

const background =
  "/assets/backgrounds/view-car-running-high-speed%20%282%29.jpg";
const logo = "/assets/icons/logo2.png";
const launchButton = "/assets/images/1.png";
const fireIcon = "/assets/icons/fire.png";

// Hot Wheels Car Collection
const hotWheelsCarsTop = [
  { name: "Blaze Runner", image: "/assets/car/Blaze Runner.png" },
  { name: "Turbo Phantom", image: "/assets/car/Turbo Phantom.png" },
  { name: "Chrome Viper", image: "/assets/car/Chrome Viper.png" },
  { name: "High Speed", image: "/assets/car/High Speed.png" },
  { name: "Neon Drifter", image: "/assets/car/Neon Drifter.png" },
];

const hotWheelsCarsBottom = [
  { name: "Speed Demon", image: "/assets/car/Speed Demon.png" },
  { name: "Purple Light", image: "/assets/car/purple light.png" },
  { name: "Thunder Bolt", image: "/assets/car/Thunder Bolt.png" },
  { name: "Fire Beast", image: "/assets/car/Fire Beast.png" },
  { name: "Steel Racer", image: "/assets/car/Steel Racer.png" },
];

// Features untuk section 3
const features = [
  {
    icon: "/assets/icons/wallet.png",
    title: "Instant Wallet Setup",
    description: "Get started in seconds with seamless onboarding",
  },
  {
    icon: "/assets/icons/nft.png",
    title: "Collect Exclusive NFTs",
    description: "Own rare digital collectibles and trade them",
  },
  {
    icon: "/assets/icons/car.png",
    title: "Earn Rewards",
    description: "Generate value from your collection",
  },
  {
    icon: "/assets/icons/comunity.png",
    title: "Community Driven",
    description: "Join thousands of collectors worldwide",
  },
];

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Show loading animation and redirect to dashboard if authenticated
  useEffect(() => {
    if (ready && authenticated) {
      setShowLoading(true);
    }
  }, [ready, authenticated]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    router.push("/dashboard");
  };

  const handleLogin = async () => {
    try {
      setLoginError(null);
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Failed to connect. Please try again.");
    }
  };

  return (
    <main className="relative overflow-x-hidden bg-black text-white">
      {/* SECTION 1: HERO */}
      <section id="hero" className="section-full relative px-4 py-12 text-center sm:px-6 sm:py-16">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${background}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="-mt-12 flex justify-center sm:-mt-16 md:-mt-20">
            <img
              src={logo}
              alt="Base Wheels"
              className="w-56 drop-shadow-[0_16px_40px_rgba(0,0,0,0.8)] sm:w-72 md:w-96"
            />
          </div>

          <h1 className="hotwheels-title hotwheels-gradient-text mt-[240px] mb-2 text-2xl font-black leading-tight sm:mt-[280px] sm:mb-3 sm:text-4xl md:mt-[320px] md:text-6xl">
            The Ultimate NFT Car Collection on Base
          </h1>

          <p className="hotwheels-tagline mb-10 text-xs uppercase tracking-widest sm:mb-12 sm:text-base md:text-lg">
            Collect. Build. Own Real Toy Cars.
          </p>

          <div className="hotwheels-launch-wrap mx-auto w-full max-w-[380px]">
            <button
              type="button"
              onClick={login}
              disabled={!ready}
              className="hotwheels-launch-button"
            >
              <img src={fireIcon} alt="Fire icon" className="hotwheels-launch-icon" />
              <span className="hotwheels-launch-text">Launch App</span>
            </button>
            {loginError && (
              <p className="mt-3 text-sm text-red-400 text-center" role="alert">
                {loginError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: ECOSYSTEM */}
      <section id="collection" className="section-full bg-gradient-to-b from-white to-gray-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-16">
        <div className="mx-auto w-full">
          <h2 className="mb-2 text-center text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            A Collection That Works For Your Crypto Ecosystem
          </h2>
          <p className="mx-auto mb-6 w-full break-words text-center text-base leading-snug text-slate-600 sm:max-w-2xl sm:mb-8 sm:text-lg md:text-xl">
            Seamless integration across platforms. Collect premium Hot Wheels
            quickly and transparently, making it easy to own collectibles in the
            digital age.
          </p>

          {/* Hot Wheels Carousel - TOP (Scrolls LEFT) */}
          <div className="relative mb-4 overflow-hidden py-4 group" aria-label="Hot Wheels collection carousel scrolling left">
            <div
              className="flex animate-scroll-left group-hover:pause-animation gap-6 sm:gap-8"
              style={{ pointerEvents: "none" }}
            >
              {[
                ...hotWheelsCarsTop,
                ...hotWheelsCarsTop,
                ...hotWheelsCarsTop,
                ...hotWheelsCarsTop,
              ].map((car, index) => (
                <div
                  key={index}
                  className="car-card group min-w-[200px] max-w-[200px] flex-shrink-0 rounded-2xl bg-white p-4 shadow-xl sm:min-w-[280px] sm:max-w-[280px] sm:p-5"
                >
                  <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-orange-gradient relative sm:mb-4 sm:h-40">
                    {/* Pola Titik (Dot Pattern) Overlay */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                      }}
                    ></div>

                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      className="relative z-10 h-full w-full object-contain scale-110"
                    />
                  </div>
                  <h3 className="text-center text-xs font-bold uppercase leading-tight tracking-wide text-slate-800 sm:text-sm md:text-base">
                    {car.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Hot Wheels Carousel - BOTTOM (Scrolls RIGHT) */}
          <div className="relative mb-4 overflow-hidden py-4 group" aria-label="Hot Wheels collection carousel scrolling right">
            <div
              className="flex animate-scroll-right group-hover:pause-animation gap-6 sm:gap-8"
              style={{ pointerEvents: "none" }}
            >
              {[
                ...hotWheelsCarsBottom,
                ...hotWheelsCarsBottom,
                ...hotWheelsCarsBottom,
                ...hotWheelsCarsBottom,
              ].map((car, index) => (
                <div
                  key={index}
                  className="car-card group min-w-[200px] max-w-[200px] flex-shrink-0 rounded-2xl bg-white p-4 shadow-xl sm:min-w-[280px] sm:max-w-[280px] sm:p-5"
                >
                  <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-orange-gradient relative sm:mb-4 sm:h-40">
                    {/* Pola Titik (Dot Pattern) Overlay */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                      }}
                    ></div>

                    <img
                      src={car.image}
                      alt={car.name}
                      className="relative z-10 h-full w-full object-contain scale-110"
                    />
                  </div>
                  <h3 className="text-center text-xs font-bold uppercase leading-tight tracking-wide text-slate-800 sm:text-sm md:text-base">
                    {car.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="features" className="section-full bg-gradient-to-b from-gray-900 to-black px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="hotwheels-title hotwheels-gradient-text mb-3 text-center text-2xl font-black sm:mb-4 sm:text-3xl md:text-5xl">
            How Base Wheels Works
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-gray-300 sm:mb-16 sm:text-base md:text-lg">
            Blockchain-powered collecting makes NFT ownership easy, secure, and
            transparent.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="hotwheels-panel group rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 sm:p-6"
              >
                <div className="mb-3 flex justify-center sm:mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 p-3 shadow-lg sm:h-20 sm:w-20 sm:p-4">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="h-8 w-8 object-contain brightness-0 invert sm:h-10 sm:w-10"
                    />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-bold text-orange-300 sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-300 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA */}
      <section id="cta" className="section-full bg-gradient-to-b from-slate-100 to-white px-4 py-12 text-slate-900 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black text-slate-900 sm:mb-6 sm:text-4xl md:text-6xl">
            Ready to Own Digital Hot Wheels? 🏎️🔥
          </h2>
          <p className="mb-8 text-base text-slate-600 sm:mb-10 sm:text-lg md:text-xl">
            Collect legendary cars as NFTs on Base blockchain. Each car is
            unique, tradeable, and exclusively yours.
          </p>

          <div className="hotwheels-launch-wrap mx-auto max-w-sm sm:max-w-md">
            <button
              type="button"
              onClick={handleLogin}
              disabled={!ready}
              className="hotwheels-launch-button"
              aria-label="Launch Base Wheels App"
            >
              <img src={fireIcon} alt="Fire icon" className="hotwheels-launch-icon" />
              <span className="hotwheels-launch-text">Launch App</span>
            </button>
            {loginError && (
              <p className="mt-3 text-sm text-red-400 text-center" role="alert">
                {loginError}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-6">
            <a
              href="#"
              className="text-xs text-slate-500 transition-colors hover:text-orange-500 sm:text-sm"
              aria-label="View documentation"
            >
              Documentation
            </a>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <a
              href="#"
              className="text-xs text-slate-500 transition-colors hover:text-orange-500 sm:text-sm"
              aria-label="Join our community"
            >
              Community
            </a>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <a
              href="#"
              className="text-xs text-slate-500 transition-colors hover:text-orange-500 sm:text-sm"
              aria-label="Get support"
            >
              Support
            </a>
          </div>
        </div>
      </section>

      {/* Loading Animation Popup */}
      <LoadingAnimation
        isVisible={showLoading}
        onComplete={handleLoadingComplete}
      />
    </main>
  );
}

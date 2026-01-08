"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/shared/BottomNavigation";

// Car data
const carCollection = [
  {
    id: 1,
    name: "ULTIMATE STRIKE",
    image: "/assets/car/Blaze Runner.png",
    rarity: "Basic",
    stats: "85/1000",
  },
  {
    id: 2,
    name: "TURBO PHANTOM",
    image: "/assets/car/Turbo Phantom.png",
    rarity: "RARE",
    stats: "92/1000",
  },
  {
    id: 3,
    name: "CHROME VIPER",
    image: "/assets/car/Chrome Viper.png",
    rarity: "EPIC",
    stats: "78/1000",
  },
  {
    id: 4,
    name: "HIGH SPEED",
    image: "/assets/car/High Speed.png",
    rarity: "LEGEND",
    stats: "95/1000",
  },
  {
    id: 5,
    name: "NEON DRIFTER",
    image: "/assets/car/Neon Drifter.png",
    rarity: "RARE",
    stats: "88/1000",
  },
  {
    id: 6,
    name: "SPEED DEMON",
    image: "/assets/car/Speed Demon.png",
    rarity: "EPIC",
    stats: "90/1000",
  },
];

export default function Dashboard() {
  const { authenticated, ready, logout } = usePrivy();
  const router = useRouter();
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [coins, setCoins] = useState(99);

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return null;
  }

  const currentCar = carCollection[currentCarIndex];

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/30 to-gray-900 text-white overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('/assets/backgrounds/view-car-running-high-speed%20(1).jpg')] bg-cover bg-center opacity-30" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen max-w-md mx-auto">
        {/* Header */}
        <header className="px-4 pt-3 pb-2">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full px-3 py-1.5 shadow-lg">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-orange-900 font-black text-xs">
                $
              </div>
              <span className="font-black text-sm">{coins}</span>
              <span className="text-lg font-bold">+</span>
            </div>

            {/* Hot Wheels Logo */}
            {/* <div className="flex-1 flex justify-center">
              <img
                src="/assets/icons/logo2.png"
                alt="Hot Wheels"
                className="h-28.5 object-contain"
              />
            </div> */}

            {/* Help Icon */}
            <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
              <span className="text-white text-xl font-bold">?</span>
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 mt-3 mb-4">
          <div className="relative h-11 rounded-full overflow-hidden shadow-xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600" />

            {/* Checkered Flag Pattern */}
            <div className="absolute right-0 top-0 bottom-0 w-24">
              <div
                className="w-full h-full"
                style={{
                  background: `
                    linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
                    linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
                    #fff
                  `,
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 5px 5px'
                }}
              />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Search..."
              className="relative z-10 w-full h-full bg-transparent text-white placeholder-white/90 px-4 pr-28 font-bold text-sm outline-none"
            />
          </div>
        </div>

        {/* ALL CAR Label */}
        <div className="px-4 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-red-500 text-lg font-black uppercase tracking-wide">
              ALL CAR
            </h2>
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-black">
                {carCollection.length}
              </span>
            </div>
          </div>
        </div>

        {/* Car Card */}
        <div className="flex-1 px-4 pb-24 overflow-y-auto">
          <div className="bg-gradient-to-br from-red-900 via-red-800 to-black rounded-3xl p-4 shadow-2xl border-4 border-orange-500">
            {/* Car Image Container */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-black rounded-2xl p-6 mb-4 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />

              {/* Car Image */}
              <img
                src={currentCar.image}
                alt={currentCar.name}
                className="w-full h-48 object-contain relative z-10 drop-shadow-2xl transform hover:scale-110 transition-transform duration-300"
              />

              {/* Stats Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 z-20">
                <p className="text-orange-400 text-xs font-bold">
                  {currentCar.rarity} {currentCar.stats}
                </p>
              </div>
            </div>

            {/* Car Name */}
            <h3 className="text-white text-xl font-black uppercase tracking-wider mb-4 text-center bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {currentCar.name}
            </h3>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mb-4">
              {carCollection.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCarIndex
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 w-8"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Buy Spin Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => router.push('/gacha')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 uppercase tracking-wider"
              >
                Buy Spin
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}

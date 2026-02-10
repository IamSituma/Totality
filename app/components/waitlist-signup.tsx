'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { WaitlistForm } from "./waitlist-form"

// Example avatars (replace with real images or URLs)
const avatars = [
  "/avatars/user1.jpg",
  "/avatars/user2.jpg",
  "/avatars/user3.jpg",
  "/avatars/user4.jpg",
  "/avatars/user5.jpg",
]

export function WaitlistSignup() {
  const [waitlistCount, setWaitlistCount] = useState(0)
  const [currentVideo, setCurrentVideo] = useState(1)

  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  const handleSuccess = (count: number) => {
    setWaitlistCount(prev => prev + count)
  }

  // switch videos every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => (prev === 1 ? 2 : 1))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden">

      {/* Background Videos */}
      <video
        ref={video1Ref}
        autoPlay
        loop
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentVideo === 1 ? "opacity-100" : "opacity-0"
          }`}
      >
        <source src="/videos/background1.mp4" type="video/mp4" />
      </video>

      <video
        ref={video2Ref}
        autoPlay
        loop
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentVideo === 2 ? "opacity-100" : "opacity-0"
          }`}
      >
        <source src="/videos/background2.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay — black bottom to transparent top */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/100 via-black/75 to-transparent"></div>

      {/* Content Container */}
      <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-end lg:flex-row lg:items-end lg:justify-between p-6 sm:p-8 lg:p-12">

        {/* LEFT Text / LOGO */}
        <div className="flex flex-col items-center lg:items-start lg:max-w-2xl space-y-4 sm:space-y-6 lg:space-y-6 text-center lg:text-left">

          {/* Logo */}
          <div className="w-36 sm:w-56 h-10 sm:h-14 relative">
            <Image
              src="/images/totality.png"
              alt="Totality Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-white leading-[1.1]">
            Join Totality
            <br />
            <span className="text-[#9ACD32] whitespace-nowrap">
              Product Waitlist.
            </span>
          </h2>


          {/* Description */}
         {/* Description */}
<p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed mt-1 sm:mt-2">
  Experience the future of logistics today. Get early access to our
  revolutionary platform and transform how you send, receive & store
  packages. Also, explore our clean energy solutions.
</p>

        </div>

        {/* Form Container */}
        <div className="w-full lg:w-auto max-w-md lg:max-w-2xl mt-4 lg:mt-0 flex flex-col items-center">

          <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl sm:shadow-2xl space-y-4 sm:space-y-6 w-full flex flex-col items-center">

            {/* Show avatars only if at least 1 person joined */}
            {waitlistCount > 0 && (
              <div className="flex items-center space-x-3 justify-center w-full">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {avatars.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`User ${index + 1}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-white font-bold text-sm sm:text-base">
                  {waitlistCount}+
                </div>
              </div>
            )}

            {/* Form */}
            <WaitlistForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  )
}

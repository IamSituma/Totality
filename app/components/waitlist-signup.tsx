'use client'

import { useState, useEffect, useRef } from "react"
import { getWaitlistCount } from "../actions/waitlist"
import { XIcon } from "./icons/x-icon"
import { DiscordIcon } from "./icons/discord-icon"
import { Avatar } from "./avatar"
import { SocialIcon } from "./social-icon"
import { WaitlistForm } from "./waitlist-form"

export function WaitlistSignup() {
  const [waitlistCount, setWaitlistCount] = useState(0)
  const [currentVideo, setCurrentVideo] = useState(1)

  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    getWaitlistCount().then((count) => setWaitlistCount(count))
  }, [])

  const handleSuccess = (count: number) => {
    setWaitlistCount(prev => prev + count)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => (prev === 1 ? 2 : 1))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
      <video
        ref={video1Ref}
        autoPlay
        loop
        muted
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${currentVideo === 1 ? "opacity-100" : "opacity-0"}`}
      >
        <source src="/videos/background1.mp4" type="video/mp4" />
      </video>
      <video
        ref={video2Ref}
        autoPlay
        loop
        muted
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${currentVideo === 2 ? "opacity-100" : "opacity-0"}`}
      >
        <source src="/videos/background2.mp4" type="video/mp4" />
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-0"></div>

      <div className="relative z-10 w-full max-w-xl mx-auto p-8 flex flex-col justify-between flex-1">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
            Join Totality Product Launch Waitlist.
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-gray-300">
            Experience the future of logistics today. Get early access to our revolutionary platform and transform how you or your business sends, receives & stores packages. Also, get a chance to explore our clean energy solutions.
          </p>

          <div className="w-full">
            <WaitlistForm onSuccess={handleSuccess} />
          </div>

          <div className="flex items-center justify-center mt-8">
            <div className="flex -space-x-2 mr-4">
              <Avatar initials="PK" index={0} />
              <Avatar initials="SA" index={1} />
              <Avatar initials="DD" index={2} />
            </div>
            <p className="text-white font-semibold">{waitlistCount}+ people on the waitlist</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <SocialIcon
              href="https://x.com/@tootality"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              icon={<XIcon className="w-6 h-6" />}
            />
            <SocialIcon
              href="https://discord.gg/jyXs6EYM"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              icon={<DiscordIcon className="w-6 h-6" />}
            />
          </div>

          <div className="text-center mt-6">
            <p className="text-l text-gray-300">For Partnerships</p>
            <a
              href="mailto:totalityops@proton.me"
              className="text-white font-medium hover:underline"
            >
              totalityops@proton.me
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

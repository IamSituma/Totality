'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Loader2 } from 'lucide-react'
import { useToast } from "../../components/ui/use-toast"

interface WaitlistFormProps {
  onSuccess: (count: number) => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const { toast } = useToast()

  // No server action state — toasts are shown directly in `handleSubmit`.

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      // Simulate network latency; backend removed.
      await new Promise((res) => setTimeout(res, 600))
      toast({ title: 'Success!', description: 'You have been added to the waitlist.' })
      onSuccess(1)
      setName('')
      setEmail('')
      setPhone('')
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'An error occurred', variant: 'destructive' })
    } finally {
      setIsPending(false)
    }
  }

  const inputClassName = `
    w-full
    border-0
    bg-transparent
    disabled:bg-transparent
    read-only:bg-transparent
    text-white
    placeholder:text-gray-400
    focus:ring-0
    focus:border-transparent
    focus-visible:border-transparent
    focus:outline-none
    active:ring-0
    active:outline-none
    focus-visible:ring-0
    focus-visible:outline-none
    active:border-transparent
    focus-visible:ring-offset-0
  `

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)
        void handleSubmit(fd)
      }}
      className="w-full space-y-3 mb-8"
    >
      <div className="flex overflow-hidden rounded-xl p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500">
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          required
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex overflow-hidden rounded-xl p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            aria-describedby="email-error"
            className={inputClassName}
          />
        </div>

        <div className="flex-1 flex overflow-hidden rounded-xl p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500">
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0701234567"
            required
            value={phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            aria-describedby="phone-error"
            className={inputClassName}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-white hover:bg-gray-500 text-black hover:text-white font-semibold px-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'Get Notified'
        )}
      </Button>
    </form>
  )
}

// actions/waitlist.ts
'use client'

export async function joinWaitlist(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email')
    if (!email) {
      return { success: false, message: 'Email is required' }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, message: data.error || 'Failed to join waitlist' }
    }

    // Fetch the updated waitlist count
    const countResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`)
    const allEmails = await countResponse.json()
    const count = allEmails.length

    return {
      success: true,
      message: data.message || 'Successfully joined waitlist',
      count,
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'An error occurred' }
  }
}

// Get waitlist count (for initial display)
export async function getWaitlistCount() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`)
    const allEmails = await response.json()
    return allEmails.length
  } catch (error) {
    return 0
  }
}

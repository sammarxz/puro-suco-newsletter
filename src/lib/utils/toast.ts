type ToastType = 'success' | 'error' | 'info'

const TOAST_CONTAINER_ID = 'toast-container'
const TOAST_DURATION = 3000 // milliseconds

let toastCounter = 0

function getToastContainer(): HTMLElement {
  const container = document.getElementById(TOAST_CONTAINER_ID)
  if (!container) {
    console.error(`Toast container with ID "${TOAST_CONTAINER_ID}" not found.`)
    // Create a fallback container if not found (e.g., for development)
    const body = document.body
    const fallbackContainer = document.createElement('div')
    fallbackContainer.id = TOAST_CONTAINER_ID
    fallbackContainer.className =
      'fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none'
    body.appendChild(fallbackContainer)
    return fallbackContainer
  }
  return container
}

async function createToastElement(
  id: string,
  message: string,
  type: ToastType
): Promise<HTMLElement> {
  // Dynamically import the Astro component to render it on the client
  // This requires Astro's client:only directive or similar setup for hydration
  // For a simple JS-only approach, we'll manually construct the HTML
  // In a real Astro app, you might use a framework like React/Vue for this,
  // or a custom Astro component that exposes a client-side API.

  // For simplicity and to avoid complex Astro client-side rendering setup for this utility,
  // we'll manually create the div with the correct classes and content.
  // This means duplicating some logic from ToastItem.astro, but keeps toast.ts pure JS.

  const toastElement = document.createElement('div')
  toastElement.id = id
  toastElement.className = `p-4 rounded-lg shadow-md text-white text-sm font-medium flex items-center gap-2 transition-all duration-300 transform translate-y-full opacity-0` // Start hidden

  let typeClasses = ''
  let iconSvg = ''

  switch (type) {
    case 'success':
      typeClasses = 'bg-green-600'
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`
      break
    case 'error':
      typeClasses = 'bg-red-600'
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`
      break
    case 'info':
      typeClasses = 'bg-blue-600'
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`
      break
  }

  toastElement.classList.add(typeClasses)
  toastElement.innerHTML = `${iconSvg}<span>${message}</span>`
  toastElement.setAttribute('role', 'alert')
  toastElement.setAttribute('aria-live', 'assertive')
  toastElement.setAttribute('aria-atomic', 'true')

  return toastElement
}

export async function showToast(message: string, type: ToastType = 'info') {
  const container = getToastContainer()
  const id = `toast-${toastCounter++}`
  const toastElement = await createToastElement(id, message, type)

  container.appendChild(toastElement)

  // Animate in
  requestAnimationFrame(() => {
    toastElement.classList.remove('translate-y-full', 'opacity-0')
    toastElement.classList.add('translate-y-0', 'opacity-100')
  })

  // Animate out and remove
  setTimeout(() => {
    toastElement.classList.remove('translate-y-0', 'opacity-100')
    toastElement.classList.add('translate-y-full', 'opacity-0')
    toastElement.addEventListener(
      'transitionend',
      () => {
        toastElement.remove()
      },
      { once: true }
    )
  }, TOAST_DURATION)
}

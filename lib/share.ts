import { toast } from 'sonner'
export async function shareReport(id: string, name: string) {
  const url = new URL(window.location.origin)
  if (new URLSearchParams(window.location.search).get('demo') === '1')
    url.searchParams.set('demo', '1')
  url.searchParams.set('screen', 'petDetail')
  url.searchParams.set('petId', id)
  try {
    if (navigator.share)
      await navigator.share({ title: `Ayudemos a ${name} · PawsConnect`, url: url.toString() })
    else {
      await navigator.clipboard.writeText(url.toString())
      toast.success('Enlace copiado')
    }
  } catch (e) {
    if (!(e instanceof DOMException && e.name === 'AbortError'))
      toast.error('No pudimos compartir el enlace')
  }
}

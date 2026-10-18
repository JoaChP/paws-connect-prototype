export async function prepareImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('Elige una imagen JPG, PNG o WebP.')
  if (file.size > 8 * 1024 * 1024) throw new Error('La imagen debe pesar menos de 8 MB.')
  const bitmap = await createImageBitmap(file)
  const ratio = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio))
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio))
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('No pudimos procesar la imagen.')
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  let data = canvas.toDataURL('image/jpeg', 0.8)
  if (data.length > 500000) data = canvas.toDataURL('image/jpeg', 0.5)
  if (data.length > 500000) throw new Error('Elige una imagen más pequeña.')
  return data
}

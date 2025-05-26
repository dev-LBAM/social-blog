export async function convertToAcceptedImage(file: File): Promise<File> {
  const acceptedTypes = ['image/jpeg', 'image/png']
  if (acceptedTypes.includes(file.type)) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Erro ao converter imagem'))
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.png', {
            type: 'image/png',
          })
          resolve(newFile)
        }, 'image/png')
      }
      img.src = reader.result as string
    }

    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

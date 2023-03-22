export const downloadFile = function (
    file: File | Blob,
    fileName: string,
  ): Promise<void> {
    try {
      const fileURL = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = fileURL
      a.download = fileName
  
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(fileURL)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }
  
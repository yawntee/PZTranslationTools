export function readTextFile(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsText(file)
    })
}

export function downloadText(filename: string, text: string) {
    const blob = new Blob([text], {type: 'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
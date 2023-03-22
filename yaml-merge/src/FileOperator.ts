import { Ref, ref } from 'vue'

export enum FileType {
    FILE = 'File',
    SNIPPETS = 'Snippets',
}

export interface File {
    name: string
    suffix: string
    index: number
    value: string
    type: string
    canCompile: boolean
    buffer?: Uint8Array
}
export interface FileOptions {
    name?: string
    suffix?: string
    type?: FileType
}



export class FileOperator {
    fileList: Ref<File[]> = ref<File[]>([])

    deleteFileByIndex(index: number) {
        this.fileList.value.splice(index, 1)
    }

    addFileByInput(str: string, options?: FileOptions) {
        const name = options?.name || `snippets-${this.fileList.value.length}`
        const suffix = options?.suffix || ''
        const type = options?.type || FileType.FILE
        this.fileList.value.push({
            name,
            suffix,
            index: this.fileList.value.length,
            value: str,
            type,
            canCompile: true,
        })
    }

    async addFileBySystemIo(url: string, options?: FileOptions) {

        const name = options?.name || `snippets-${this.fileList.value.length}`
        const suffix = options?.suffix || ''
        const result = await $he3.readFileByUrl(url)
        const buffer = await $he3.readFileAsArrayBuffer(url)
        const type = options?.type || FileType.FILE
        this.fileList.value.push({
            name,
            suffix,
            index: this.fileList.value.length,
            value: result,
            buffer: buffer,
            type,
            canCompile: true,
        })
    }

    getFileList() {
        return this.fileList.value
    }

    markErrorToFile(index: number) {
        this.fileList.value[index].canCompile = false
    }
}

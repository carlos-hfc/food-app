import { randomUUID } from "node:crypto"
import { createWriteStream } from "node:fs"
import { resolve } from "node:path"
import { pipeline } from "node:stream"
import { promisify } from "node:util"

import { MultipartFile } from "@fastify/multipart"

interface UploadParams {
  file: MultipartFile
}

const pump = promisify(pipeline)

export async function uploadFile({ file }: UploadParams) {
  const uploadId = randomUUID()
  const uploadFilename = `${uploadId}-${file.filename}`

  const writeStream = createWriteStream(
    resolve(__dirname, "..", "..", "uploads", uploadFilename),
  )

  await pump(file.file, writeStream)

  return {
    url: `/uploads/${uploadFilename}`,
  }
}

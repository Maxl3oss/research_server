import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf'
  ) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const uploads = multer({
  // storage: storage,
  fileFilter: fileFilter,
  storage: multer.diskStorage({}),
  // storage: multer.memoryStorage(),
  limits: {
    fieldSize: 10 * 1024 * 1024,
    fileSize: 50000000, // Around 10MB
  },
});

const iMulter = { uploads, fileFilter }

export default iMulter;
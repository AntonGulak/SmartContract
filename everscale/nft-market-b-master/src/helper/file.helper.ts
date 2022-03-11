import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { globals } from '../config/globals';
import { uploading } from '../config/uploading';

export class UploadResult {
    folder: string;
    webPath: string = '';
    errors: string[] = [];

    constructor(folder: string) {
        this.folder = folder;
    }
}

export class FileHelper {
    /**
     * Uploads file into the server
     * @param { UploadedFile } uploadedFile
     * @param { UploadResult } uploadResult
     * @return { boolean } upload status
     * Usage:
     * const uploadResult = new UploadResult('products');
     * if (await this.fileHelper.upload(req.files?.product as UploadedFile, uploadResult)) {
     *    // use file web path from `uploadResult.webPath`
     * } else {
     *    // handle validation errors from `uploadResult.errors`
     * }
     */
    async upload(uploadedFile: UploadedFile, uploadResult: UploadResult): Promise<boolean> {
        if (!FileHelper.validateUploadedFile(uploadedFile, uploadResult)) {
            return false;
        }

        const fileName = this.generateFileName();
        const extension = this.getExtension(uploadedFile.name);
        uploadResult.webPath = [
            uploading.ROOT_FOLDER,
            uploadResult.folder,
            fileName.substr(0, 2),
            fileName.substr(2, 2),
            fileName + '.' + extension
        ].join('/');
        await uploadedFile.mv(globals.PUBLIC_ROOT + uploadResult.webPath);
        return true;
    }

    getExtension(fileName: string): string {
        return fileName.split('.').pop() || '';
    }

    generateFileName(): string {
        return uuidv4();
    }

    private static validateUploadedFile(uploadedFile: UploadedFile, uploadResult: UploadResult): boolean {
        let isValid = true;

        if (!uploadedFile) {
            uploadResult.errors.push(`No uploaded file.`);
            return false;
        }

        if (uploadedFile.size > uploading.MAX_FILE_SIZE_MB * 1024 * 1024) {
            uploadResult.errors.push(`The file size must not exceed ${ uploading.MAX_FILE_SIZE_MB }Mb.`);
            isValid = false;
        }

        if (!uploading.ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
            uploadResult.errors.push(`Unsupported MIME type ${ uploadedFile.mimetype }.`);
            isValid = false;
        }

        return isValid;
    }
}

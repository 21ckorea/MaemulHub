export declare class UploadsController {
    upload(files: Express.Multer.File[]): {
        files: {
            filename: string;
            mimetype: string;
            size: number;
            path: string;
            url: string;
        }[];
    };
}

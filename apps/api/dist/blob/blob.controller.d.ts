export declare class BlobController {
    upload(files: Express.Multer.File[]): Promise<{
        files: {
            url: string;
            pathname: string;
            size: number;
            contentType: string | undefined;
        }[];
    }>;
}

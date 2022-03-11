import { globals } from "../config/globals";
import * as path from 'path';
import { Options, resize, identify, crop } from "imagemagick";
import { ServerErrorError } from "../error/server-error.error";

export class ImageHelper {
    resizeWidthOrHeight(webPath: string, size: number): string {
        const srcPath = this.getSrcPath(webPath);
        const dstPath = this.getResizedSrcPath(srcPath, size);
        identify(srcPath, function(err, features ) {
            if (err) throw err;
            const featuresWidth = features.width || 0;
            const featuresHeight = features.height || 0;
            if (!featuresWidth || !featuresHeight) {
                throw new ServerErrorError('Non-sized image');
            }
            const options = <Options>{
                srcPath: srcPath,
                dstPath: dstPath
            };
            if (featuresWidth >= featuresHeight) {
                options.width = size;
            } else {
                options.height = size;
            }
            resize(options, function (err) {
                if (err) throw err;
            });
        });
        return dstPath;
    }

    resizeWidth(webPath: string, width: number): string {
        const srcPath = this.getSrcPath(webPath);
        const dstPath = this.getResizedSrcPath(srcPath, width);
        resize({
            srcPath: srcPath,
            dstPath: dstPath,
            width: width
        }, function (err){
            if (err) throw err;
        });
        return dstPath;
    }

    cropToSquare(webPath: string, sizes: number[] = []): string {
        const srcPath = this.getSrcPath(webPath);
        const crpPath = this.getCroppedSrcPath(srcPath);
        identify(srcPath, (err, features ) => {
            if (err) throw err;
            const featuresWidth = features.width || 0;
            const featuresHeight = features.height || 0;
            if (!featuresWidth || !featuresHeight) {
                throw new ServerErrorError('Non-sized image');
            }
            const crpSize = featuresHeight > featuresWidth ? featuresWidth : featuresHeight;
            crop({
                srcPath: srcPath,
                dstPath: crpPath,
                width: crpSize,
                height: crpSize,
            }, (err) => {
                if (err) throw err;
                sizes.forEach((width) => {
                    resize({
                        srcPath: crpPath,
                        dstPath: this.getResizedSrcPath(webPath, width),
                        width: width
                    }, (err) => {
                        if (err) throw err;
                    });
                })
            });
        });
        return crpPath;
    }

    getResizedSrcPath(webPath: string, size: number): string {
        return this.getSrcPath(webPath) + '-' + size + '.' + ImageHelper.getExtension(webPath);
    }

    getResizedWebPath(webPath: string, size: number): string {
        return path.join(globals.BASE_PATH, webPath) + '-' + size + '.' + ImageHelper.getExtension(webPath);
    }

    getCroppedSrcPath(webPath: string): string {
        return this.getSrcPath(webPath) + '-cropped.' + ImageHelper.getExtension(webPath);
    }

    getCroppedWebPath(webPath: string): string {
        return path.join(globals.BASE_PATH, webPath) + '-cropped.' + ImageHelper.getExtension(webPath);
    }

    getSrcPath(webPath: string): string {
        if (!webPath.includes(path.resolve(globals.PUBLIC_ROOT))) {
            return path.join(globals.PUBLIC_ROOT, webPath);
        }
        return webPath;
    }

    private static getExtension(webPath: string): string {
        return webPath.split('.').pop() || '';
    }
}
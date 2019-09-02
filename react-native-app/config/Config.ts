import config from '../config.json';
import { RNFS } from 'react-native-fs';

export class Config {
    htmlDir: string;
    pageCount: number;

    constructor() {
        this.htmlDir = config.htmlDir;
        this.pageCount = config.pageCount;
    }

    public getUri(page: number) {
        return "file:///android_asset/" + this.getHtmlDir() + "/" + page + ".html";
    }

    public getHtmlDir() {
        return this.htmlDir;
    }

    public getPageCount() {
        return this.pageCount;
    }
}
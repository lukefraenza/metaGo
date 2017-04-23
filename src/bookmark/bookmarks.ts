import * as vscode from "vscode";
import fs = require("fs");
import { Bookmark, JumpDirection } from "./bookmark";
import { BookmarkConfig } from './config';

export class Bookmarks {

    public static normalize(uri: string): string {
        // a simple workaround for what appears to be a vscode.Uri bug
        // (inconsistent fsPath values for the same document, ex. ///foo/x.cpp and /foo/x.cpp)
        return uri.replace("///", "/");
    }

    public bookmarks: Bookmark[];
    public activeBookmark: Bookmark = undefined;

    constructor() {
        this.bookmarks = [];
    }

    public dispose() {
        this.zip();
    }

    public loadFrom(jsonObject, relativePath?: boolean) {
        if (jsonObject === "") {
            return;
        }

        let jsonBookmarks = jsonObject.bookmarks;
        for (let idx = 0; idx < jsonBookmarks.length; idx++) {
            let jsonBookmark = jsonBookmarks[idx];

            // each bookmark (line)
            this.add(jsonBookmark.fsPath);
            for (let element of jsonBookmark.bookmarks) {
                this.bookmarks[idx].bookmarks.push(element);
            }
        }

        if (relativePath) {
            for (let element of this.bookmarks) {
                element.fsPath = element.fsPath.replace("$ROOTPATH$", vscode.workspace.rootPath);
            }
        }
    }

    public fromUri(uri: string) {
        uri = Bookmarks.normalize(uri);
        for (let element of this.bookmarks) {
            if (element.fsPath === uri) {
                return element;
            }
        }
    }

    public add(uri: string) {
        uri = Bookmarks.normalize(uri);

        let existing: Bookmark = this.fromUri(uri);
        if (typeof existing === "undefined") {
            let bookmark = new Bookmark(uri);
            this.bookmarks.push(bookmark);
        }
    }

    public nextDocumentWithBookmarks(active: Bookmark, direction: JumpDirection = JumpDirection.FORWARD): Promise<string> {
        let currentBookmark: Bookmark = active;
        let currentBookmarkIndex: number;
        for (let index = 0; index < this.bookmarks.length; index++) {
            let element = this.bookmarks[index];
            if (element === active) {
                currentBookmarkIndex = index;
            }
        }

        return new Promise((resolve, reject) => {
            if (direction === JumpDirection.FORWARD) {
                currentBookmarkIndex++;
                if (currentBookmarkIndex === this.bookmarks.length) {
                    currentBookmarkIndex = 0;
                }
            } else {
                currentBookmarkIndex--;
                if (currentBookmarkIndex === -1) {
                    currentBookmarkIndex = this.bookmarks.length - 1;
                }
            }

            currentBookmark = this.bookmarks[currentBookmarkIndex];

            if (currentBookmark.bookmarks.length === 0) {
                if (currentBookmark === this.activeBookmark) {
                    resolve('');
                    return;
                } else {
                    this.nextDocumentWithBookmarks(currentBookmark, direction)
                        .then((nextDocument) => {
                            resolve(nextDocument);
                            return;
                        })
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                }
            } else {
                if (fs.existsSync(currentBookmark.fsPath)) {
                    resolve(currentBookmark.fsPath);
                    return;
                } else {
                    this.nextDocumentWithBookmarks(currentBookmark, direction)
                        .then((nextDocument) => {
                            resolve(nextDocument);
                            return;
                        })
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                }
            }

        });

    }

    public nextBookmark(active: Bookmark, position: vscode.Position) {
        let currentLine: number = position.line;
        let currentBookmark: Bookmark = active;
        let currentBookmarkId: number;
        for (let index = 0; index < this.bookmarks.length; index++) {
            let element = this.bookmarks[index];
            if (element === active) {
                currentBookmarkId = index;
            }
        }

        return new Promise((resolve, reject) => {
            currentBookmark.nextBookmark(position)
                .then((newLine) => {
                    resolve(newLine);
                    return;
                })
                .catch((error) => {
                    // next document
                    currentBookmarkId++;
                    if (currentBookmarkId === this.bookmarks.length) {
                        currentBookmarkId = 0;
                    }
                    currentBookmark = this.bookmarks[currentBookmarkId];

                });

        });
    }

    public zip(relativePath?: boolean): Bookmarks {
        function isNotEmpty(book: Bookmark): boolean {
            return book.bookmarks.length > 0;
        }

        let newBookmarks: Bookmarks = new Bookmarks();
        newBookmarks.bookmarks = JSON.parse(JSON.stringify(this.bookmarks)).filter(isNotEmpty);

        if (!relativePath) {
            return newBookmarks;
        }

        for (let element of newBookmarks.bookmarks) {
            element.fsPath = element.fsPath.replace(vscode.workspace.rootPath, "$ROOTPATH$");
        }
        return newBookmarks;
    }
}

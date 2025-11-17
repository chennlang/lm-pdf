import { createContext } from "react";
import { EasyPdfProps, Events, IPdfContext } from "./types";
import mitt from "mitt";
const emitter = mitt<Events>();

export const PdfContext = createContext<IPdfContext>({
    loadPageImage: () => Promise.resolve(""),
    loadPageRectList: () => [],
    pages: [],
    gap: 20,
    emitter,
});
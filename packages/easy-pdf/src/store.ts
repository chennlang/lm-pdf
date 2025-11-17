import { atom } from 'recoil'
import { PdfRect } from './types';

export const scaleState = atom<number>({
    key: "scale",
    default:1,
});

export const paginationState = atom<{
    currentPage: number;
    totalPage: number;
}>({
    key: "pagination",
    default: {
        currentPage: 1,
        totalPage: 1,
    },
});

// 当前高亮的矩形
export const activeViewerRectState = atom<{
    id: number | string;
    page: number;
} | null>({
    key: "activeViewerRect",
    default: null,
});

// 当前高亮的矩形列表
export const highlightViewerRectsState = atom<number | string[]>({
    key: "highlightViewerRects",
    default: [],
});

export const editingBlockState = atom<{
    index: number;
    originContent: string;
    editingContent: string;
}>({
    key: "editingBlock",
    default: {
        index: -1,
        originContent: '',
        editingContent: ''
    },
});
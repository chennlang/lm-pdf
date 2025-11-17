import { Emitter } from "mitt";
import React from "react";

export interface Page {
    id: string | number;
    page: number;
    width: number;
    height: number;
}

export type Events = {
    'viewerScrollToPage': {
        page: number;
        top?: number;
        left?: number;
    };
    'setActiveViewerRect': {
        id: number | string;
        page: number;
    };
    'mdBlocksJumpToIndex': number;
}

export interface EasyPdfProps {
    emitterRef?: React.RefObject<Emitter<Events>> | ((emitter: Emitter<Events>) => void);
    // 方法：单页的图片
    loadPageImage: (item: Page) => Promise<any>;
    // 方法：目标页面的选区
    loadPageRectList?: (item: Page) => PdfRect [];
    onRectClick?:(block: PdfRect, page: Page) => void;
    onPageChange?:(page?: Page) => void;
    pages: Page[];
    // 页面之间的间距高度
    gap: number;
    children: React.ReactNode;
    // 默认显示页面
    defaultPage?: number;
}

interface ScrollTo {
    page: number;
    blockId: string | number;
  }

export interface CanvasContainerProps {
    className?: string;
}

export interface IPdfContext extends Omit<EasyPdfProps, 'children'> {
    emitter: Emitter<Events>
}   

export interface PdfRect {
    id: string | number;
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [k: string]: any
}

// 列表项的数据类型
export interface MdBlockItem {
    content: string;
    type: string;
    [k: string]: any;
}
  
// 主列表组件的属性类型
export interface EasyBlocksProps {
    items: MdBlockItem[];
    scrollToIndex?: number;
    onBlockClick?: (block: MdBlockItem) => void;
    blockType?: 'html' | 'markdown' | 'text';
    beforeCopy?: (content: string) => string;
    onChange?: (index: number, content: string) => void;
    editable?: boolean;
}

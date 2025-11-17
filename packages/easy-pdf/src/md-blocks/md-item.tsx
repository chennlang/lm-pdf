import {
  memo,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdBlockItem } from "../types";
import { useCopy } from "../hooks";
import IconButton from "../icons/icon-button";
import { CancelIcon, CopyIcon, EditIcon, SaveIcon } from "../icons";
import { useRecoilState } from "recoil";
import { editingBlockState } from "../store";

// // 自定义组件
const MdItem: React.FC<{
  item: MdBlockItem;
  index: number;
  blockType: "html" | "markdown" | "text";
  editable?: boolean;
  onChange?: (index: number, content: string) => void;
  beforeCopy: (content: string) => string;
  onClick: () => void;
}> = memo(
  ({
    item,
    index,
    blockType,
    editable = true,
    onChange,
    onClick,
    beforeCopy = (content: string) => content,
  }) => {
    const scopeCls = "item-container";
    const activeCls = "";
    const { copyToClipboard } = useCopy();
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const [editingBlock, setEditingBlock] = useRecoilState(editingBlockState);
    const isEditing = editingBlock.index === index;

    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await copyToClipboard(beforeCopy(item.content));
    };

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = item.content;
      }
      setEditingBlock({
        index,
        originContent: item.content,
        editingContent: item.content,
      });
    };

    const handleSave = (e: React.MouseEvent) => {
      e.stopPropagation();
      const content = contentEditableRef.current?.innerHTML || "";
      if (onChange) {
        onChange(index, content);
      }
      setEditingBlock({ index: -1, originContent: "", editingContent: "" });
    };

    const handleCancel = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = item.content;
      }
      setEditingBlock({ index: -1, originContent: "", editingContent: "" });
    };

    const handleInput = (e: React.FormEvent) => {
      const content = (e.target as HTMLDivElement).innerHTML;
      setEditingBlock((prev) => ({
        ...prev,
        editingContent: content,
      }));
    };

    const handleContainerClick = useCallback(() => {
      onClick();
    }, [onClick]);

    useEffect(() => {
      if (isEditing) {
        contentEditableRef.current?.focus();
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML = item.content;
        }
      }
    }, [isEditing, item.content]);

    const renderHtmlContent = () => {
      if (isEditing) {
        return (
          <div
            ref={contentEditableRef}
            id={`${index}-html-content`}
            className={
              scopeCls +
              "-html-content overflow-auto absolute z-10 border max-w-full max-h-full"
            }
            contentEditable={true}
            suppressContentEditableWarning={true}
            onClick={(e) => e.stopPropagation()}
            onInput={handleInput}
          />
        );
      }

      return (
        <div
          ref={contentEditableRef}
          id={`${index}-html-content`}
          className={scopeCls + "-html-content"}
          contentEditable={false}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      );
    };

    return (
      <div className={scopeCls + activeCls} onClick={handleContainerClick}>
        <h3 className={scopeCls + "-header"}>
          <span>{item.type}</span>
          <p className={scopeCls + "-header-btns"}>
            {!isEditing && (
              <>
                <IconButton
                  icon={<CopyIcon />}
                  title="复制"
                  onClick={handleCopy}
                ></IconButton>
                {editable && (
                  <IconButton
                    icon={<EditIcon />}
                    title="编辑"
                    onClick={handleEdit}
                  ></IconButton>
                )}
              </>
            )}
            {isEditing && (
              <>
                <IconButton
                  icon={<SaveIcon />}
                  title="保存"
                  onClick={handleSave}
                ></IconButton>
                <IconButton
                  icon={<CancelIcon />}
                  title="取消"
                  onClick={handleCancel}
                ></IconButton>
              </>
            )}
          </p>
        </h3>
        {blockType === "html" && renderHtmlContent()}
        {blockType !== "html" && (
          <pre className={scopeCls + "-content"}>{item.content}</pre>
        )}
      </div>
    );
  }
);

MdItem.displayName = "MdItem";

export default MdItem;

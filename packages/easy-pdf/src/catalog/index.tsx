import { memo, useState, useMemo, useEffect, useContext } from "react";
import "./index.css";
import { PdfContext } from "../context";

// 使用泛型来支持扩展属性
interface CatalogItem<T = any> {
  title: string;
  id: string;
  children?: CatalogItem<T>[];
  expanded?: boolean;
  // 扩展其他属性
  [key: string]: any;
}

interface CatalogProps<T = any> {
  data: CatalogItem<T>[];
  defaultExpandAll?: boolean;
  // 添加点击回调
  onNodeClick?: (node: CatalogItem<T>) => void;
}

function Catalog<T = any>({
  data,
  defaultExpandAll = false,
  onNodeClick,
}: CatalogProps<T>) {
  const pdfContext = useContext(PdfContext);
  const [searchText, setSearchText] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>("");

  const getAllIds = (items: CatalogItem<T>[]): string[] => {
    return items.reduce<string[]>((acc, item) => {
      acc.push(item.id);
      if (item.children && item.children.length > 0) {
        acc.push(...getAllIds(item.children));
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    if (defaultExpandAll) {
      const allIds = getAllIds(data);
      setExpandedItems(new Set(allIds));
    }
  }, [data, defaultExpandAll]);

  const searchInTree = (
    items: CatalogItem<T>[],
    searchTerm: string
  ): CatalogItem<T>[] => {
    return items.reduce<CatalogItem<T>[]>((acc, item) => {
      const matches = item.title.toLowerCase().includes(searchTerm);
      const childMatches = item.children
        ? searchInTree(item.children, searchTerm)
        : [];

      if (matches || childMatches.length > 0) {
        acc.push({
          ...item,
          children: childMatches,
        });
      }
      return acc;
    }, []);
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const search = searchText.toLowerCase();
    return searchInTree(data, search);
  }, [data, searchText]);

  const expandSearchResults = (items: CatalogItem<T>[]) => {
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        setExpandedItems((prev) => new Set([...prev, item.id]));
        expandSearchResults(item.children);
      }
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value) {
      const results = searchInTree(data, value.toLowerCase());
      expandSearchResults(results);
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发节点选中
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 处理节点点击
  const handleNodeClick = (node: CatalogItem<T>) => {
    setSelectedId(node.id);
    onNodeClick?.(node);
  };

  const renderItem = (item: CatalogItem<T>, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedId === item.id;

    return (
      <div key={item.id} className={`catalog-item depth-${depth}`}>
        <div
          className={`catalog-item-title ${isSelected ? "selected" : ""}`}
          onClick={() => handleNodeClick(item)}
          title={item.title}
        >
          {hasChildren && (
            <span
              className={`expand-icon ${isExpanded ? "expanded" : ""}`}
              onClick={(e) => toggleExpand(item.id, e)}
            >
              {isExpanded ? "▼" : "▶"}
            </span>
          )}
          <span className="title-text">{item.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="catalog-children">
            {item.children?.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="catalog-container">
      {/* <div className="search-box">
        <input
          type="text"
          placeholder="请输入搜索关键词"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div> */}
      <div className="catalog-content">
        {filteredData.map((item) => renderItem(item))}
      </div>
    </div>
  );
}

export default memo(Catalog) as typeof Catalog;

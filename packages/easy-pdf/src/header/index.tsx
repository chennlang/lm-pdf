import { memo, useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { paginationState, scaleState } from "../store";
import "./index.css";
import { PdfContext } from "../context";
import { useScaleTools } from "../hooks";
import { useDebounce } from "ahooks";

const PageInput = ({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
  min: number;
}) => {
  const [page, setPage] = useState(value);
  const debouncedValue = useDebounce(page, { wait: 500 });

  function checkAndUpdate(v: number) {
    if (v > max) {
      setPage(max);
    } else if (v < min) {
      setPage(min);
    } else {
      setPage(v);
    }
    if (v !== value) {
      onChange(v);
    }
  }

  useEffect(() => {
    if (value !== page) {
      setPage(value);
    }
  }, [value]);

  useEffect(() => {
    checkAndUpdate(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      type="number"
      className="easy-pdf-header-input"
      value={page}
      onChange={(e) => setPage(Number(e.target.value))}
    ></input>
  );
};

const Header = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  const [pagination, setPagination] = useRecoilState(paginationState);
  const [scale, setScale] = useRecoilState(scaleState);
  const { emitter } = useContext(PdfContext);
  const scaleTools = useScaleTools();

  function handleCurrentChange(value: number | string) {
    if (Number(value) < 1 || Number(value) > pagination.totalPage) return;

    emitter.emit("viewerScrollToPage", {
      page: Number(value),
    });
  }

  return (
    <div className={"easy-pdf-header " + className}>
      <div className="font-bold">{title}</div>
      {/* 缩放 */}
      <div className="easy-pdf-header-buttons">
        <span
          onClick={() => {
            if (scale === scaleTools.options[0].value) return;
            setScale(parseFloat((scale - 0.25).toFixed(2)));
          }}
        >
          -
        </span>
        <label>
          <select
            value={scale}
            onChange={(e) => {
              setScale(Number(e.target.value));
            }}
          >
            {scaleTools.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <span
          onClick={() => {
            if (
              scale === scaleTools.options[scaleTools.options.length - 1].value
            )
              return;
            setScale(parseFloat((scale + 0.25).toFixed(2)));
          }}
        >
          +
        </span>
        <label></label>
        {/* 翻页 */}
        <span
          onClick={() => {
            handleCurrentChange(1);
          }}
        >
          {"I<"}
        </span>
        <span
          onClick={() => {
            handleCurrentChange(Number(pagination.currentPage) - 1);
          }}
        >
          {"<"}
        </span>
        {/* <input
          type="number"
          className="easy-pdf-header-input"
          value={current}
          min={1}
          max={pagination.totalPage}
          onChange={(e) => handleCurrentChange(e.target.value)}
        ></input> */}
        <PageInput
          value={Number(pagination.currentPage)}
          onChange={handleCurrentChange}
          min={1}
          max={pagination.totalPage}
        />
        <label>/</label>
        <label>{pagination.totalPage}</label>
        <span
          onClick={() => {
            handleCurrentChange(Number(pagination.currentPage) + 1);
          }}
        >
          {">"}
        </span>
        <span
          onClick={() => {
            handleCurrentChange(pagination.totalPage);
          }}
        >
          {">I"}
        </span>
      </div>
    </div>
  );
};

export default memo(Header);

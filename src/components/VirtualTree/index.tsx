import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

export type ColumnProps = {
  key: string;
  title: string;
  width?: number;
  fixed?: "left" | "right";
  render?: (props: { value: any; row: any; col: any }) => React.ReactNode;
};

export type TableProps = {
  list: any[];
  rowKey?: string;
  column: ColumnProps[];
  itemHeight?: number;
  tableHeight?: number;
  tableWidth?: number;
};

const scrollWidth = 20;
// 真实dom的条数
const showLength = 20;
let scrollTop = 0;

const Comp: React.FC<TableProps> = ({
  list,
  rowKey,
  column,
  tableWidth,
  tableHeight,
  itemHeight = 40,
}) => {
  const scrollRef = useRef<any>();
  const contentRef = useRef<any>();

  // 显示多少条数据
  const [showData, setShowData] = useState<any[]>([]);

  // 虚拟滚动高度
  const scrollHeight = useMemo(
    () => list.length * itemHeight,
    [itemHeight, list.length]
  );

  // 固定的列
  const columns = useMemo(() => {
    const left = column.filter((col) => col.fixed === "left");
    const right = column.filter((col) => col.fixed === "right");
    const all = [...left, ...column.filter((col) => !col.fixed), ...right];
    return { left, right, all };
  }, [column]);

  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    setShowData(list.slice(0, showLength));
    setTimeout(() => setContentHeight(contentRef.current.clientHeight), 100);
  }, [list]);

  // 滚动Y轴
  const onScrollY = (e: React.UIEvent<HTMLDivElement>) => {
    scrollTop = e.currentTarget.scrollTop;
    const start = Math.round(scrollTop / itemHeight);
    const newShowData = list.slice(start, start + showLength);
    setShowData(newShowData);
  };

  // 鼠标滚轮事件
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    let top = Math.min(scrollTop + itemHeight, list.length * itemHeight);
    if (e.deltaY < 1) top = Math.max(0, scrollTop - itemHeight);
    scrollRef.current.scrollTop = top;
  };

  // 不传组件高度就使用 flex-grow: 1 自适应
  const containerStyle = useMemo<React.CSSProperties>(() => {
    return tableHeight
      ? { width: tableWidth, height: tableHeight }
      : { width: tableWidth, flexGrow: 1 };
  }, [tableHeight, tableWidth]);

  // 获取表头
  const getTableHeader = (_cols: ColumnProps[]) => (
    <div className="col" style={{ height: itemHeight }}>
      {_cols.map((col, index) => (
        <div
          key={col.key || index}
          style={{ width: col.width }}
          className={classNames("col-cell", { grow1: !col.fixed })}
        >
          <span className="text-ellipsis">{col.title}</span>
        </div>
      ))}
    </div>
  );

  // 获取列
  const getTableColumn = (_cols: ColumnProps[]) => (
    <>
      {showData.map((row: any, rowIndex) => (
        <div
          className="col"
          key={rowKey ? row[rowKey] : rowIndex}
          style={{ height: itemHeight }}
        >
          {_cols.map((col, colIndex) => (
            <div
              key={col.key || colIndex}
              style={{ width: col.width }}
              className={classNames("col-cell", { grow1: !col.fixed })}
            >
              <span className="text-ellipsis">
                {col.render
                  ? col.render({ row, col, value: row[col.key] })
                  : row[col.key]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </>
  );

  const getFixedCol = (_column: ColumnProps[], fixed: ColumnProps["fixed"]) => {
    if (!_column.length) return <></>;
    return (
      <div
        onWheel={onWheel}
        className="table-content table-fixed"
        style={
          fixed === "right"
            ? { height: contentHeight, right: scrollWidth }
            : { height: contentHeight, left: 0 }
        }
      >
        {getTableHeader(_column)}
        {getTableColumn(_column)}
      </div>
    );
  };
  return (
    <div className="container" style={containerStyle}>
      {/* 固定的列 */}
      {getFixedCol(columns.left, "left")}
      {getFixedCol(columns.right, "right")}
      {/* 其他列 */}
      <div
        ref={contentRef}
        onWheel={onWheel}
        className="table-content scroll-x"
      >
        {getTableHeader(columns.all)}
        {getTableColumn(columns.all)}
      </div>
      {/* 滚动条Y */}
      <div
        ref={scrollRef}
        className="scroll-y"
        onScroll={onScrollY}
        style={{ width: scrollWidth }}
      >
        <div style={{ height: scrollHeight + itemHeight + 20 }}></div>
      </div>
    </div>
  );
};

export default Comp;

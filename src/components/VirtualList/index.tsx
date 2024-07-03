import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

export type ColumnProps = {
  key: string;
  title: string;
  width?: number;
  rowKey?: string;
  fixed?: "left" | "right" | true;
};

export type TableProps = {
  list: any[];
  column: ColumnProps[];
  itemHeight?: number;
  tableHeight?: number;
};

const getList = (conunt: number) => {
  return new Array(conunt).fill(0).map((_, index) => ({
    index: index + 1,
    id: Math.random(),
    name: "xxxx",
    address: "xds,是多少范德萨第三方第三方dsfdsf发送到",
    content: "dfsd地方",
    xxx: "xxx都是开发就",
  }));
};

const column: ColumnProps[] = [
  { width: 200, fixed: true, title: "序号", key: "index" },
  { width: 100, fixed: "right", title: "内容都是开发", key: "id" },
  { width: 250, fixed: "right", title: "内容", key: "name" },
  { width: 600, title: "地址", key: "address" },
  { width: 200, title: "嘻嘻嘻", key: "content" },
];

const list = getList(500);
const itemHeight = 40;
const tableHeight = undefined;
const tableWidth = undefined;
const rowKey = "id";
const showLength = 20;
const scrollWidth = 20;

let scrollTop = 0;

const Comp: React.FC = () => {
  const scrollRef = useRef<any>();
  const contentRef = useRef<any>();
  // 显示多少条数据
  const [showData, setShowData] = useState<any[]>([]);
  // 虚拟滚动高度
  const scrollHeight = useMemo(() => list.length * itemHeight, []);
  // 固定的列
  const fixedColumn = useMemo(() => {
    return {
      left: column.filter((col) => col.fixed === "left" || col.fixed === true),
      right: column.filter((col) => col.fixed === "right"),
    };
  }, []);

  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    setShowData(list.slice(0, showLength));
    setTimeout(() => setContentHeight(contentRef.current.clientHeight), 100);
  }, []);

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
  }, []);

  // 获取表头
  const getTableHeader = (_cols: ColumnProps[]) => (
    <div className="col" style={{ height: itemHeight }}>
      {_cols.map((col, index) => (
        <div
          className="col-cell"
          key={col.key || index}
          style={{ width: col.width }}
        >
          <span className="text-ellipsis">{col.title}</span>
        </div>
      ))}
    </div>
  );

  // 获取列
  const getTableColumn = (_cols: ColumnProps[]) => (
    <>
      {showData.map((item: any, index) => (
        <div
          className="col"
          key={item[rowKey] || index}
          style={{ height: itemHeight }}
        >
          {_cols.map((col, index) => (
            <div
              className="col-cell"
              key={col.key || index}
              style={{ width: col.width }}
            >
              <span className="text-ellipsis">{item[col.key]}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );

  const getFixedCol = (_column: ColumnProps[], fixed: ColumnProps["fixed"]) => {
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
      {getFixedCol(fixedColumn.left, "left")}
      {getFixedCol(fixedColumn.right, "right")}
      {/* 其他列 */}
      <div
        ref={contentRef}
        onWheel={onWheel}
        className="table-content scroll-x"
      >
        {getTableHeader(column)}
        {getTableColumn(column)}
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

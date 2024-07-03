/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import "./index.css";

export type ColumnProps = {
  key: string;
  title: string;
  width?: number;
  rowKey?: string;
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
  { width: 200, title: "序号", key: "index" },
  // { width: 100, title: "内容都是开发", key: "id" },
  { width: 200, title: "内容", key: "name" },
  { width: 200, title: "地址", key: "address" },
  { width: 200, title: "嘻嘻嘻", key: "content" },
];

const list = getList(500);

const itemHeight = 40;
const tableHeight = undefined;
const tableWidth = undefined;
const showItemLength = 20;
const rowKey = "id";

let scrollTop = 0;

const Comp: React.FC = () => {
  const listRef = useRef<any>();
  const scrollRef = useRef<any>();

  // 显示多少条数据
  const [showData, setShowData] = useState(list.slice(0, showItemLength));
  // 虚拟滚动高度
  const scrollHeight = useMemo(() => list.length * itemHeight, []);

  // 滚动Y轴
  const onScrollY = (e: React.UIEvent<HTMLDivElement>) => {
    scrollTop = e.currentTarget.scrollTop;
    const start = Math.round(scrollTop / itemHeight);
    const newShowData = list.slice(start, start + showItemLength);
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

  return (
    <div className="container" style={containerStyle}>
      {/* 固定在左侧的列 */}
      {/* <div className="fixed" onWheel={onWheel}>
          {showData.map((item, index) => (
            <div
              key={index}
              className="col"
              style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
            >
              <div className="col-cell" style={{ width: 200 }}>
                {item}
              </div>
            </div>
          ))}
        </div> */}

      <div ref={listRef} onWheel={onWheel} className="table-content scroll-x">
        {/* 表头 */}
        <div className="col" style={{ height: itemHeight }}>
          {column.map((col, index) => (
            <div
              className="col-cell"
              key={col.key || index}
              style={{ width: col.width }}
            >
              <span className="text-ellipsis">{col.title}</span>
            </div>
          ))}
        </div>
        {/* 数据 */}
        {showData.map((item: any, index) => (
          <div
            className="col"
            key={item[rowKey] || index}
            style={{ height: itemHeight }}
          >
            {column.map((col, index) => (
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
      </div>
      {/* 滚动条Y */}
      <div ref={scrollRef} className="scroll-y" onScroll={onScrollY}>
        <div style={{ height: scrollHeight + itemHeight }}></div>
      </div>
    </div>
  );
};

export default Comp;

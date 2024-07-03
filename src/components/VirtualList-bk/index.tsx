/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import "./index.css";

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

const column = [
  { width: 200, title: "序号", key: "index" },
  { width: 100, title: "内容都是开发", key: "id" },
  { width: 200, title: "内容", key: "name" },
  { width: 200, title: "地址", key: "address" },
  { width: 200, title: "嘻嘻嘻", key: "content" },
];

const Comp: React.FC = () => {
  const headerRef: any = useRef();

  const tableHeight = 400;
  // const tablewidth = 600;
  const itemHeight = 40;

  const list = getList(500);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [scrollTop, setscrollTop] = useState(0);

  const showList = useMemo(() => {
    if (!startIndex && !endIndex) {
      return list.slice(0, tableHeight / itemHeight);
    }
    return list.slice(startIndex, endIndex + 1);
  }, [endIndex, list, startIndex]);

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const targrt = e.target as HTMLDivElement;
    headerRef.current.scrollLeft = targrt.scrollLeft;
  };

  const onScrollContainer = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const start = Math.round(scrollTop / itemHeight);
    const end = Math.round(start + tableHeight / itemHeight);
    setscrollTop(scrollTop);
    setStartIndex(start);
    setEndIndex(end);
  };

  return (
    <div className="_vlist_ border">
      <div
        className="virtual-scroll"
        onScroll={onScrollContainer}
        style={{ height: tableHeight }}
      >
        {/* 实际的数据区域 */}
        <div
          onScroll={onScroll}
          style={{ transform: `translateY(${scrollTop}px)` }}
        >
          <table className="table">
            {showList.map((item: any) => (
              <tr style={{ height: `${itemHeight}px` }} data-index={item.index}>
                {column.map((col) => (
                  <td>
                    <div
                      className="table-cell"
                      style={{ width: `${col.width || 100}px` }}
                    >
                      {item[col.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
        {/* 高度补齐 */}
        <div
          style={{
            height: list.length * itemHeight - showList.length * itemHeight,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Comp;

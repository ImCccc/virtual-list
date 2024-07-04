import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckIcon,
  RadioCheckIcon,
  RadioUnCheckIcon,
  SomeCheckIcon,
  UnCheckIcon,
} from "../Icon";
import "./index.css";

export type ColumnProps = {
  key: string;
  title: string | React.ReactNode;
  width?: number;
  fixed?: "left" | "right";
  aligin?: "left" | "center" | "right";
  render?: (props: { value: any; row: any; col: any }) => React.ReactNode;
};

export type EventProps = (
  record: any,
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;

export type SelectedKeysProps = string[];
export type OnSelectProps = (
  selectedRowKeys: SelectedKeysProps,
  selected: boolean,
  record: any
) => void;
export type OnSelectAllProps = (
  selected: boolean,
  allRowKeys: SelectedKeysProps
) => void;
export type RowSelectionProps = {
  selectedRowKeys: SelectedKeysProps; // 选中项的 key 数组，需要和 onChange 进行配合
  fixed?: boolean; // 把选择框列固定在左边
  hideSelectAll?: boolean; // 隐藏全选勾选框
  type?: "checkbox" | "radio"; // 多选/单选
  onSelect?: OnSelectProps; // 用户手动选择/取消选择某行的回调
  onSelectAll?: OnSelectAllProps; // 用户手动选择/取消选择所有行的回调
};

export type TableProps = {
  list: any[];
  rowKey?: string;
  column: ColumnProps[];
  itemHeight?: number;
  tableHeight?: number;
  tableWidth?: number;
  rowHoverBg?: string;
  rowSelectedBg?: string;
  rowSelection?: RowSelectionProps;
  onRowClick?: EventProps;
  onRowMouseEnter?: EventProps;
  onRowMouseLeave?: EventProps;
  onRowDoubleClick?: EventProps;
};

const scrollWidth = 20;
// 真实dom的条数
const showLength = 20;
let scrollTop = 0;

const Comp: React.FC<TableProps> = ({
  list,
  column,
  tableWidth,
  tableHeight,
  rowSelection,
  rowKey = "",
  itemHeight = 40,
  rowHoverBg = "#dcf4ff",
  rowSelectedBg = "#dcf4ff",
  onRowClick,
  onRowMouseLeave,
  onRowMouseEnter,
  onRowDoubleClick,
}) => {
  const scrollRef = useRef<any>();
  const contentRef = useRef<any>();

  // 鼠标移至哪一行的 index
  const [hoverIndex, setHoverIndex] = useState<number>();

  // 在哪条数据开始显示
  const [startIndex, setStartIndex] = useState(0);

  // 当前显示的数据
  const showData = useMemo(
    () => list.slice(startIndex, startIndex + showLength),
    [list, startIndex]
  );

  // 虚拟滚动高度
  const scrollHeight = useMemo(
    () => list.length * itemHeight,
    [itemHeight, list.length]
  );

  const selectAllStatus = useMemo(() => {
    const selectedLen = rowSelection?.selectedRowKeys.length;
    if (!selectedLen) return <UnCheckIcon className="pointer" />;
    if (selectedLen === list.length) return <CheckIcon className="pointer" />;
    return <SomeCheckIcon className="pointer" />;
  }, [list.length, rowSelection?.selectedRowKeys]);

  const getSelectdColumn = useCallback(() => {
    if (!rowSelection) return null;
    const { selectedRowKeys, fixed, onSelect, type } = rowSelection;
    const selectCol: ColumnProps = {
      key: "-_-",
      width: 60,
      aligin: "center",
      fixed: fixed ? "left" : undefined,
      title: type === "checkbox" ? selectAllStatus : "",
      render: ({ row }) => {
        const id = row[rowKey || "id"];
        if (type === "checkbox") {
          // 多选
          return selectedRowKeys.includes(id) ? (
            <CheckIcon
              className="pointer"
              onClick={() => {
                const curKeys = selectedRowKeys.filter((sid) => id !== sid);
                onSelect?.(curKeys, false, row);
              }}
            />
          ) : (
            <UnCheckIcon
              className="pointer"
              onClick={() => {
                const curKeys = Array.from(new Set([...selectedRowKeys, id]));
                onSelect?.(curKeys, true, row);
              }}
            />
          );
        }
        // 单选
        return selectedRowKeys.includes(id) ? (
          <RadioCheckIcon
            className="pointer"
            onClick={() => onSelect?.([], false, row)}
          />
        ) : (
          <RadioUnCheckIcon
            className="pointer"
            onClick={() => onSelect?.([id], true, row)}
          />
        );
      },
    };

    return selectCol;
  }, [rowKey, rowSelection, selectAllStatus]);

  // 固定的列
  const columns = useMemo(() => {
    const left = column.filter((col) => col.fixed === "left");
    const right = column.filter((col) => col.fixed === "right");
    const center = column.filter((col) => !col.fixed);
    // 如果列表需要选择
    const selectCol = getSelectdColumn();
    if (selectCol)
      (selectCol.fixed === "left" ? left : center).unshift(selectCol);

    const all = [...left, ...center, ...right];
    return { left, right, all };
  }, [column, getSelectdColumn]);

  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    setTimeout(() => setContentHeight(contentRef.current.clientHeight), 100);
  }, [list]);

  // 滚动Y轴
  const onScrollY = (e: React.UIEvent<HTMLDivElement>) => {
    scrollTop = e.currentTarget.scrollTop;
    const start = Math.round(scrollTop / itemHeight);
    setStartIndex(start);
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
          key={index}
          style={{ width: col.width }}
          className={classNames("col-cell", { grow1: !col.fixed })}
        >
          <span className="text-ellipsis" style={{ textAlign: col.aligin }}>
            {col.title}
          </span>
        </div>
      ))}
    </div>
  );

  // 获取列
  const getTableColumn = (_cols: ColumnProps[]) => {
    const getBg = (rowIndex: number, id = "") => {
      if (hoverIndex === rowIndex) return rowHoverBg;
      if (rowSelection?.selectedRowKeys.includes(id)) return rowSelectedBg;
      return "";
    };
    return showData.map((row: any, rowIndex) => (
      <div
        className="col"
        key={row[rowKey] || rowIndex}
        style={{
          height: itemHeight,
          background: getBg(rowIndex, row[rowKey]),
        }}
        onClick={(e) => {
          onRowClick?.(row, e);
        }}
        onDoubleClick={(e) => {
          onRowDoubleClick?.(row, e);
        }}
        onMouseEnter={(e) => {
          setHoverIndex(rowIndex);
          onRowMouseEnter?.(row, e);
        }}
        onMouseLeave={(e) => {
          setHoverIndex(undefined);
          onRowMouseLeave?.(row, e);
        }}
      >
        {_cols.map((col, colIndex) => (
          <div
            key={colIndex}
            style={{ width: col.width }}
            className={classNames("col-cell", { grow1: !col.fixed })}
          >
            <span className="text-ellipsis" style={{ textAlign: col.aligin }}>
              {col.render
                ? col.render({ row, col, value: row[col.key] })
                : row[col.key]}
            </span>
          </div>
        ))}
      </div>
    ));
  };

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

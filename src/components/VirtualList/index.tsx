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
export type SelectKeysProps = string[];
export type EventProps = (
  record: any,
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;
export type OnSelectProps = (
  electedRowKeys: SelectKeysProps,
  selected: boolean,
  record: any
) => void;
export type OnSelectAllProps = (
  allRowKeys: SelectKeysProps,
  selected: boolean
  // changeRowKeys: SelectKeysProps
) => void;
export type RowSelectionProps = {
  selectedRowKeys: SelectKeysProps; // 选中项的 key 数组，需要和 onChange 进行配合
  type?: "checkbox" | "radio"; // 多选/单选
  fixed?: boolean; // 把选择框列固定在左边
  hideSelectAll?: boolean; // 隐藏全选勾选框
  disabledKeys?: SelectKeysProps; // 禁止用户操作的行
  onSelect?: OnSelectProps; // 用户手动选择/取消选择某行的回调
  onSelectAll?: OnSelectAllProps; // 用户手动选择/取消选择所有行的回调
};
export type TableProps = {
  list: any[]; // 数据
  rowKey?: string;
  column: ColumnProps[];
  tableHeight?: number;
  tableWidth?: number;
  itemHeight?: number; // 行高
  treeList?: any[]; // 树结构的数据,全选需要用到
  rowHoverBg?: string; // 鼠标移至行的背景颜色
  rowSelectedBg?: string; // 选中行的背景颜色
  rowSelection?: RowSelectionProps; // 选择行的配置
  onRowClick?: EventProps; // 点击行
  onRowMouseEnter?: EventProps; // 双击行
  onRowMouseLeave?: EventProps; // 鼠标移至行
  onRowDoubleClick?: EventProps; // 鼠标离开行
};

const scrollWidth = 20;
// 真实dom的条数
const showLength = 20;

const Comp: React.FC<TableProps> = ({
  list,
  column,
  treeList,
  tableWidth,
  tableHeight,
  rowSelection,
  rowKey = "",
  itemHeight = 40,
  rowHoverBg = "#f0faff",
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

  const scrollTop = useRef(0);

  // 在哪条数据开始显示
  const [startIndex, setStartIndex] = useState(0);

  // 当前显示的数据
  const showData = useMemo(
    () => list.slice(startIndex, startIndex + showLength),
    [list, startIndex]
  );

  // 虚拟滚动高度
  const scrollHeight = useMemo(
    () => list.length * itemHeight + itemHeight + 20,
    [itemHeight, list.length]
  );

  // 选中的数据转为对象形式
  const selectedKeysObj = useMemo<{ [k: string]: boolean }>(() => {
    return rowSelection
      ? rowSelection.selectedRowKeys.reduce(
          (obj, cur) => ({ ...obj, [cur]: true }),
          {} as { [k: string]: boolean }
        )
      : {};
  }, [rowSelection]);

  const selectAllStatus = useMemo(() => {
    if (!rowSelection) return;
    const { selectedRowKeys, onSelectAll, disabledKeys } = rowSelection;
    const selectedLen = selectedRowKeys.length;

    // 过滤掉 disabled 的所有选项, 如果是树结构, 当前列表不会包含收缩起来的行, 所以使用传递进来的treeList
    const filterDisabledKeys = (treeList || list)
      .map((item) => item[rowKey])
      .filter((id) => !disabledKeys?.includes(id));

    // disabled 并且被选中的选项
    const disabledCheckKeys =
      disabledKeys?.filter((id) => selectedKeysObj[id]) || [];

    // 全选, 需要过滤掉 disabled 并且未选中的选项,
    // 有时候 selectedRowKeys 中的选项并不在列表中, 也要包含
    const checkAll = () => {
      onSelectAll?.(
        [...new Set([...filterDisabledKeys, ...selectedRowKeys])],
        true
      );
    };

    // 判断是否全选, disabled 的选项忽略
    const isCheckAll = filterDisabledKeys.every((id) => selectedKeysObj[id]);

    if (!selectedLen) {
      // 完全未选择
      return <UnCheckIcon className="pointer" onClick={checkAll} />;
    }

    if (isCheckAll) {
      // 已经全选
      return (
        <CheckIcon
          className="pointer"
          onClick={() => onSelectAll?.(disabledCheckKeys, false)}
        />
      );
    }

    // 选择了一些
    return <SomeCheckIcon className="pointer" onClick={checkAll} />;
  }, [list, rowKey, rowSelection, selectedKeysObj, treeList]);

  const getSelectdColumn = useCallback(() => {
    if (!rowSelection) return null;
    const {
      fixed,
      onSelect,
      disabledKeys,
      hideSelectAll,
      selectedRowKeys,
      type = "checkbox",
    } = rowSelection;

    const title =
      type === "checkbox" && hideSelectAll !== true && selectAllStatus;

    const selectCol: ColumnProps = {
      title,
      width: 60,
      key: "_selectd",
      aligin: "center",
      fixed: fixed ? "left" : undefined,
      render: ({ row }) => {
        const id = row[rowKey || "id"];
        const iconProps = {
          className: "pointer",
          disabled: disabledKeys?.includes(id),
        };
        if (type === "checkbox") {
          // 多选
          return selectedRowKeys.includes(id) ? (
            <CheckIcon
              {...iconProps}
              onClick={() => {
                const curKeys = selectedRowKeys.filter((_id) => id !== _id);
                onSelect?.(curKeys, false, row);
              }}
            />
          ) : (
            <UnCheckIcon
              {...iconProps}
              onClick={() => {
                const curKeys = [...selectedRowKeys, id];
                onSelect?.(curKeys, true, row);
              }}
            />
          );
        }
        // 单选
        return selectedRowKeys[0] === id ? (
          <RadioCheckIcon
            {...iconProps}
            onClick={() => {
              // 禁止操作的id, 刚好被选中
              if (disabledKeys?.includes(selectedRowKeys[0])) return;
              onSelect?.([], false, row);
            }}
          />
        ) : (
          <RadioUnCheckIcon
            {...iconProps}
            onClick={() => {
              // 禁止操作的id, 刚好被选中
              if (disabledKeys?.includes(selectedRowKeys[0])) return;
              onSelect?.([id], true, row);
            }}
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

  // 滚动Y轴
  const onScrollY = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      scrollTop.current = e.currentTarget.scrollTop;
      setStartIndex(Math.round(scrollTop.current / itemHeight));
    },
    [itemHeight]
  );

  // 鼠标滚轮事件
  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      const curScrollTop = scrollTop.current;
      let top = Math.min(curScrollTop + itemHeight, list.length * itemHeight);
      if (e.deltaY < 1) top = Math.max(0, curScrollTop - itemHeight);
      scrollRef.current.scrollTop = top;
    },
    [itemHeight, list.length]
  );

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
    return (
      _column.length && (
        <div
          onWheel={onWheel}
          className={`table-content table-fixed ${fixed}`}
          style={
            fixed === "right"
              ? { height: contentHeight, right: scrollWidth }
              : { height: contentHeight, left: 0 }
          }
        >
          {getTableHeader(_column)}
          {getTableColumn(_column)}
        </div>
      )
    );
  };

  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    setTimeout(() => setContentHeight(contentRef.current.clientHeight), 100);
    const resize = () => setContentHeight(contentRef.current.clientHeight);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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
        <div style={{ height: scrollHeight }}></div>
      </div>
    </div>
  );
};

export default Comp;

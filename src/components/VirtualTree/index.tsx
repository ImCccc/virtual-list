<<<<<<< HEAD
import { useMemo } from "react";
=======
import { useCallback, useMemo, useState } from "react";
>>>>>>> f82b72424893754fb245b3f9fd7edb5b9d3d517a
import VirtualList, { TableProps } from "../VirtualList";
import "./index.css";

export type VirtualTreeProps = {
  foldSpan?: number;
  childrenKey?: string;
  defaultExpandAllRows?: boolean;
};

<<<<<<< HEAD
// 数组打平
const flatten = (list: any[], allList = [], _level = 0) => {
  return [
    ...allList,
    ...list.reduce((all, { children, ...item }) => {
      all.push({ ...item, _level });
      if (children && children.length) {
        flatten(children, allList, _level + 1);
=======
const PlusSquareOutlined: React.FC<{ onClick: any }> = ({ onClick }) => {
  return (
    <span className="add-icon" onClick={onClick}>
      <span></span>
      <span></span>
    </span>
  );
};
const MinusSquareOutlined: React.FC<{ onClick: any }> = ({ onClick }) => {
  return (
    <span className="add-icon" onClick={onClick}>
      <span></span>
    </span>
  );
};

// 数组打平
const flatten = (list: any[], allList = [], parentId?: string, _level = 0) => {
  return [
    ...allList,
    ...list.reduce((all, item) => {
      item._level = _level;
      item._parentId = parentId;
      item._uuid = `uuid-${Math.random()}`;
      item._hasChild = !!item.children?.length;
      all.push(item);
      if (item._hasChild) {
        flatten(item.children, allList, item._uuid, _level + 1);
>>>>>>> f82b72424893754fb245b3f9fd7edb5b9d3d517a
      }
      return all;
    }, allList),
  ];
};

<<<<<<< HEAD
const Comp: React.FC<TableProps & VirtualTreeProps> = ({ list, ...props }) => {
  console.log(flatten(list));

  const flattenList = useMemo(() => {
    return flatten(list);
  }, [list]);

  return <VirtualList list={flattenList} {...props} />;
=======
const Comp: React.FC<TableProps & VirtualTreeProps> = ({
  list,
  column,
  foldSpan = 14,
  defaultExpandAllRows = true,
  ...props
}) => {
  // 展开的行
  const [expandRows, setExpandRows] = useState<{ [k: string]: boolean }>({});

  // 打平树结构
  const flattenList = useMemo(() => flatten(list), [list]);

  const showList = useMemo(() => {
    return flattenList.filter((item) => {
      const pid = item._parentId;
      if (!pid) return true;
      return (
        expandRows[pid] === true ||
        (defaultExpandAllRows && expandRows[pid] !== false)
      );
    });
  }, [defaultExpandAllRows, expandRows, flattenList]);

  const _onClick = useCallback(
    (uuid: string, expand: boolean) => {
      setExpandRows({ ...expandRows, [uuid]: expand });
    },
    [expandRows]
  );

  const getExpandIcon = useCallback(
    (uuid: string) => {
      return expandRows[uuid] === true ||
        (defaultExpandAllRows && expandRows[uuid] !== false) ? (
        // 当前状态是展开， 显示收缩 icon
        <MinusSquareOutlined onClick={() => _onClick(uuid, false)} />
      ) : (
        // 当前状态是收起来，或者默认是收起来并且没有操作过
        <PlusSquareOutlined onClick={() => _onClick(uuid, true)} />
      );
    },
    [_onClick, defaultExpandAllRows, expandRows]
  );

  const treeColumn = useMemo(() => {
    return column.map((col, index) => {
      if (index) return col;
      const _col = col;
      _col.render = ({ value, row }) => {
        return (
          <span
            className="fold-box"
            style={{ marginLeft: `${row._level * foldSpan}px` }}
          >
            {row._hasChild && getExpandIcon(row._uuid)}
            <span className="fold-value">{value}</span>
          </span>
        );
      };
      return _col;
    });
  }, [column, foldSpan, getExpandIcon]);

  return <VirtualList column={treeColumn} list={showList} {...props} />;
>>>>>>> f82b72424893754fb245b3f9fd7edb5b9d3d517a
};

export default Comp;

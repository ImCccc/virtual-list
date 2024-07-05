import { useCallback, useMemo, useState } from "react";
import { ExpandIcon, FoldIcon } from "../Icon";
import VirtualList, {
  RowSelectionProps,
  SelectKeysProps,
  TableProps,
} from "../VirtualList";
import "./index.css";

export type VirtualTreeProps = {
  foldSpan?: number;
  childrenKey?: string;
  rowSelection?: TreeRowSelectionProps;
  defaultExpandAllRows?: boolean;
};

export type TreeRowSelectionProps = RowSelectionProps & {
  checkStrictly?: boolean; // true: 状态下节点选择完全受控（父子数据选中状态不再关联）
};

const _titleLeft = 20;

// 数组打平
let _maxLevel = 1;
const flatten = (list: any[], cKey = "children", allList = [], _pid = "") => {
  return [
    ...allList,
    ...list.reduce((all, item, index) => {
      item._parentId = _pid;
      item._id = _pid ? `${_pid}-${index + 1}` : `${index + 1}`;
      item._hasChild = !!item[cKey]?.length;
      item._level = item._id.split("-").length;
      _maxLevel = Math.max(_maxLevel, item._level);
      all.push(item);
      if (item._hasChild) flatten(item[cKey], cKey, allList, item._id);
      return all;
    }, allList),
  ];
};

const Comp: React.FC<TableProps & VirtualTreeProps> = ({
  list,
  column,
  foldSpan = 14,
  rowSelection,
  rowKey = "_id",
  childrenKey = "children",
  defaultExpandAllRows = true,
  ...props
}) => {
  // 展开的行
  const [expandRows, setExpandRows] = useState<{ [k: string]: boolean }>({});

  // 打平树结构
  const flattenList = useMemo(
    () => flatten(list, childrenKey),
    [childrenKey, list]
  );

  // 获取行的收缩状态
  const getParentCollapsedState = useCallback(
    (pid: string) =>
      expandRows[pid] !== undefined ? expandRows[pid] : defaultExpandAllRows,
    [defaultExpandAllRows, expandRows]
  );

  // 当前显示的数据
  const showList = useMemo(() => {
    const showItemIds: { [k: string]: boolean } = {};
    const list = flattenList.reduce((showList, item) => {
      const { _parentId, _id } = item;
      if (!_parentId) {
        // 顶层都显示
        showItemIds[_id] = true;
        showList.push(item);
      } else if (showItemIds[_parentId] && getParentCollapsedState(_parentId)) {
        // 父亲是显示状态, 并且父亲没有折叠起来
        showItemIds[_id] = true;
        showList.push(item);
      }
      return showList;
    }, []);
    return list;
  }, [flattenList, getParentCollapsedState]);

  // 树收缩折叠
  const onExpandRow = useCallback(
    (uuid: string, expand: boolean) =>
      setExpandRows({ ...expandRows, [uuid]: expand }),
    [expandRows]
  );

  const getExpandIcon = useCallback(
    (_id: string) =>
      getParentCollapsedState(_id) ? (
        <ExpandIcon
          className="add-icon"
          onClick={(e) => {
            e?.stopPropagation();
            onExpandRow(_id, false);
          }}
        />
      ) : (
        <FoldIcon
          className="add-icon"
          onClick={(e) => {
            e?.stopPropagation();
            onExpandRow(_id, true);
          }}
        />
      ),
    [getParentCollapsedState, onExpandRow]
  );

  const treeColumn = useMemo(() => {
    const _column = column.map((col, index) => {
      if (index) return col;
      const _col = { ...col };
      const _render = _col.render;
      _col.render = (data) => {
        const { value, row } = data;
        return (
          <span
            style={{
              position: "relative",
              marginLeft: row._level * foldSpan,
            }}
          >
            {row._hasChild && getExpandIcon(row._id)}
            <span style={{ marginLeft: _titleLeft }}>
              {_render ? _render(data) : value}
            </span>
          </span>
        );
      };
      return _col;
    });

    // 重置折叠的宽度, 保证所有子选项都能显示
    _column[0].width =
      (_column[0].width || 60) + _maxLevel * foldSpan + _titleLeft * 2;

    return _column;
  }, [column, foldSpan, getExpandIcon]);

  const getChildren = useCallback(
    (row: any, disabledKeys: SelectKeysProps) => {
      let sInx =
        flattenList.findIndex((item) => item[rowKey] === row[rowKey]) + 1;
      const maxlevel = flattenList[sInx]._level;
      const childrenIds: SelectKeysProps = [row[rowKey]];
      for (sInx; sInx < flattenList.length; sInx++) {
        const curLevel = flattenList[sInx]._level;
        if (curLevel < maxlevel) break;
        const cid = flattenList[sInx][rowKey];
        // 过滤禁止操作的数据
        if (!disabledKeys.includes(cid))
          childrenIds.push(flattenList[sInx][rowKey]);
      }
      return childrenIds;
    },
    [flattenList, rowKey]
  );

  const treeRowSelection = useMemo<TreeRowSelectionProps | undefined>(() => {
    if (!rowSelection) return;
    const {
      onSelect,
      disabledKeys,
      selectedRowKeys,
      checkStrictly = true,
      ...props
    } = rowSelection;
    return {
      onSelect: (curKeys, check, row) => {
        if (!checkStrictly || !row._hasChild) {
          return onSelect?.(curKeys, check, row);
        }
        const childrenIds = getChildren(row, disabledKeys || []);
        onSelect?.(
          check
            ? [...new Set([...selectedRowKeys, ...childrenIds])]
            : selectedRowKeys.filter((id) => !childrenIds.includes(id)),
          check,
          row
        );
      },
      selectedRowKeys,
      disabledKeys,
      ...props,
    };
  }, [getChildren, rowSelection]);

  return (
    <VirtualList
      rowKey={rowKey}
      list={showList}
      column={treeColumn}
      treeList={flattenList}
      rowSelection={treeRowSelection}
      {...props}
    />
  );
};

export default Comp;

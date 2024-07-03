import { useMemo } from "react";
import VirtualList, { TableProps } from "../VirtualList";

export type VirtualTreeProps = {
  childrenKey?: string;
};

// 数组打平
const flatten = (list: any[], allList = [], _level = 0) => {
  return [
    ...allList,
    ...list.reduce((all, { children, ...item }) => {
      all.push({ ...item, _level });
      if (children && children.length) {
        flatten(children, allList, _level + 1);
      }
      return all;
    }, allList),
  ];
};

const Comp: React.FC<TableProps & VirtualTreeProps> = ({ list, ...props }) => {
  console.log(flatten(list));

  const flattenList = useMemo(() => {
    return flatten(list);
  }, [list]);

  return <VirtualList list={flattenList} {...props} />;
};

export default Comp;

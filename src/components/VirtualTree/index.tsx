import VirtualList, { TableProps } from "../VirtualList";

export type VirtualTreeProps = {
  childrenKey?: string;
};

const Comp: React.FC<TableProps & VirtualTreeProps> = (props) => {
  return <VirtualList {...props} />;
};

export default Comp;

import "./App.css";
import { ColumnProps } from "./components/VirtualList";
import VirtualTree from "./components/VirtualTree";

const getList = (conunt: number) => {
  return new Array(conunt).fill(0).map(() => ({
    address: Math.random(),
    children: [
      {
        address: Math.random(),
        children: [
          {
            address: Math.random(),
            children: [{ address: Math.random() }],
          },
        ],
      },
      {
        address: Math.random(),
        children: [{ address: Math.random() }],
      },
      { address: Math.random() },
    ],
  }));
};

const column: ColumnProps[] = [
  { width: 200, fixed: "left", title: "地址", key: "_level" },
  // { width: 100, title: "序号", key: "index" },
  // { width: 100, fixed: "right", title: "内容都是开发", key: "id" },
  {
    width: 200,
    title: "地址",
    key: "address",
    render: ({ value }) => "xxx" + value,
  },
  { width: 200, title: "地址", key: "address" },
  { width: 200, title: "地址", key: "address" },
  // { width: 200, title: "地址", key: "address" },
  // { width: 100, title: "嘻嘻嘻", key: "content" },
  // { width: 150, fixed: "right", title: "内容", key: "name" },
];

const list = getList(10);
const tableHeight = undefined;
const tableWidth = undefined;
const rowKey = "id";

function App() {
  return (
    <div className="aaa">
      <div className="aaa1">aaa1</div>
      <div className="aaa2">
        <div className="aaa3">aaa3</div>
        <VirtualTree
          list={list}
          column={column}
          rowKey={rowKey}
          tableWidth={tableWidth}
          tableHeight={tableHeight}
        />
      </div>
    </div>
  );
}

export default App;

import "./App.css";
import VirtualList, { ColumnProps } from "./components/VirtualList";

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
  { width: 100, fixed: "left", title: "序号", key: "index" },
  { width: 100, fixed: "right", title: "内容都是开发", key: "id" },
  { width: 200, title: "地址", key: "addrsdess" },
  { width: 200, title: "地址", key: "addredsdsss" },
  { width: 200, title: "地址", key: "addredsfsdss" },
  { width: 200, title: "地址", key: "addredsssdfs" },
  { width: 200, title: "地址", key: "addressfsdfs" },
  { width: 100, title: "嘻嘻嘻", key: "content" },
  { width: 150, fixed: "right", title: "内容", key: "name" },
];

const list = getList(5000);
const tableHeight = undefined;
const tableWidth = undefined;
const rowKey = "id";

function App() {
  return (
    <div className="aaa">
      <div className="aaa1">aaa1</div>
      <div className="aaa2">
        <div className="aaa3">aaa3</div>
        <VirtualList
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

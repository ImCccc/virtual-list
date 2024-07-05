import { useState } from "react";
import "./App.css";
import { ColumnProps } from "./components/VirtualList";
import VirtualTree from "./components/VirtualTree";

let index = 1;
const getList = (conunt: number) => {
  return new Array(conunt).fill(0).map(() => ({
    address: index++ + "---" + Math.random(),
    children: [
      {
        address: index++ + "---" + Math.random(),
        children: [
          {
            address: index++ + "---" + Math.random(),
          },
        ],
      },
      {
        address: index++ + "---" + Math.random(),
        children: [
          { address: index++ + "---" + Math.random() },
          {
            address: index++ + "---" + Math.random(),
          },
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
        ],
      },
      {
        address: index++ + "---" + Math.random(),
        children: [
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
        ],
      },
      { address: index++ + "---" + Math.random() },
      {
        address: index++ + "---" + Math.random(),
        children: [
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
          { address: index++ + "---" + Math.random() },
        ],
      },
      { address: index++ + "---" + Math.random() },
    ],
  }));
};

const column: ColumnProps[] = [
  {
    width: 120,
    fixed: "left",
    title: "uuid",
    key: "_id",
  },
  // { width: 100, title: "序号", key: "index" },
  // { width: 100, fixed: "right", title: "内容都是开发", key: "id" },
  { width: 200, title: "级别", key: "_level" },
  { width: 200, title: "地址", key: "address" },
  { width: 200, title: "地址", key: "address" },
  { width: 200, title: "地址", key: "address" },
  { width: 100, title: "嘻嘻嘻", key: "content" },
  { width: 150, fixed: "right", title: "内容", key: "name" },
];

const list = getList(10);

function App() {
  const defval: any = [];
  const [selectedRowKeys, setselectedRowKeys] = useState<string[]>(defval);

  return (
    <div className="aaa">
      <VirtualTree
        list={list}
        column={column}
        // rowKey={rowKey}
        // defaultExpandAllRows={false}
        // tableWidth={800}
        // tableHeight={400}
        // onRowClick={(row) => console.log(row)}
        // onRowDoubleClick={(row) => console.log(row)}
        rowSelection={{
          // type: "radio",
          // hideSelectAll: true,
          fixed: true,
          selectedRowKeys,
          disabledKeys: ["1-1", "1-1-1", "1-1-1-1-1"],
          onSelect: (selectedRowKeys) => {
            setselectedRowKeys(selectedRowKeys);
          },
          onSelectAll: (allRowKeys) => {
            setselectedRowKeys(allRowKeys);
          },
        }}
      />
      {/* <div className="aaa1">aaa1</div>
      <div className="aaa2">
        <div className="aaa3">aaa3</div>
      </div> */}
    </div>
  );
}

export default App;

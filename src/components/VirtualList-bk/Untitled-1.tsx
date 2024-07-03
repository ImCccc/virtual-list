function ScrollVirtual() {
  const [dataTotal] = useState(1000);
  const itemHeight = 28;
  const itemoffset = 8;
  const containerHeight = 400;
  const [showDataNumber] = useState(
    Math.round(containerHeight / (itemHeight + itemoffset))
  );
  const offsetTotal = showDataNumber * itemoffset;
  const [list] = useState(
    Array.from({ length: dataTotal }, (_, index) => index + 1)
  );
  const [showData, setShowData] = useState(list.slice(0, showDataNumber));

  const onScrollContainer = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const start = Math.round(scrollTop / itemHeight);
    const end = Math.round(start + containerHeight / itemHeight);
    const newShowData = list.slice(start, end + 1);
    setShowData(newShowData);
  };

  return (
    <>
      <div
        style={{
          height: containerHeight,
          overflow: "hidden",
          width: "500px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          onScroll={onScrollContainer}
          style={{
            zIndex: 100,
            height: containerHeight,
            width: "500px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: list.length * itemHeight + offsetTotal,
              width: "100%",
            }}
          ></div>
        </div>
        <div style={{ position: "absolute", left: 0 }}>
          {showData.map((item) => (
            <div
              style={{ height: itemHeight, marginBottom: itemoffset }}
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScrollVirtual;

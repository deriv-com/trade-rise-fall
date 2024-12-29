import { useEffect } from "react";
import "./App.css";
import { DerivTrading } from "./components/DerivTrading";
import { setSmartChartsPublicPath } from "@deriv/deriv-charts";
import { getUrlBase } from "./utils/url";

function App() {
  useEffect(() => {
    console.log(getUrlBase("/js/smartcharts/"), "smart");
    setSmartChartsPublicPath(getUrlBase("/js/smartcharts/"));
  }, []);
  return (
    <div className="container">
      <h1>Deriv Trading App</h1>
      <div className="env-info"></div>
      <DerivTrading />
    </div>
  );
}

export default App;

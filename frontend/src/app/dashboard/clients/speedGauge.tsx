import React, { useState, useEffect } from "react";
import ReactSpeedometer from "react-d3-speedometer";

interface SpeedGaugeProps {
  speed: number;
}

const SpeedGauge: React.FC<SpeedGaugeProps> = ({ speed }) => {
  return (
    <div style={{ width: "300px", height: "200px" }}>
      <ReactSpeedometer
        maxValue={200} // Adjust as needed
        value={speed}
        needleColor="red"
        startColor="green"
        segments={10}
        endColor="red"
      />
    </div>
  );
};

export default SpeedGauge;

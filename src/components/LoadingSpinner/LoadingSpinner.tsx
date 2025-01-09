import React from "react";
import { Spinner } from "@deriv-com/quill-ui";

const LoadingSpinner: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <div
      style={
        {
          "--component-textIcon-normal-prominent": "var(--system-color-black)",
        } as React.CSSProperties
      }
    >
      <Spinner size="lg" />
    </div>
  </div>
);

export default LoadingSpinner;

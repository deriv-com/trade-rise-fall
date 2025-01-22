import React from "react";
import "./ReconnectingLoader.scss";

export const ReconnectingLoader: React.FC = () => {
  return (
    <div className="reconnecting-loader" data-testid="reconnecting-loader">
      <div className="reconnecting-loader__spinner" data-testid="reconnecting-spinner"></div>
      <div className="reconnecting-loader__text">
        <span>Reconnecting</span>
        <span className="reconnecting-loader__dots" data-testid="reconnecting-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
};

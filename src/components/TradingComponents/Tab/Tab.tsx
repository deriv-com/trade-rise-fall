import "./Tab.scss";

interface TabProps<T extends string> {
  tabs: {
    label: string;
    value: T;
  }[];
  activeTab: T;
  onChange: (value: T) => void;
}

export const Tab = <T extends string>({ tabs, activeTab, onChange }: TabProps<T>): JSX.Element => {
  return (
    <div className="tab-container">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${activeTab === tab.value ? "active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

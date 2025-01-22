import React from 'react';

// Mock TextFieldWithSteppers component
export const TextFieldWithSteppers = ({
  value,
  onChange,
  status,
  message,
  unitRight,
  minusDisabled,
  ...props
}: any) => (
  <div data-testid="text-field-with-steppers">
    <input
      type="text"
      value={value}
      onChange={onChange}
      {...props}
    />
    <button
      onClick={() => onChange({ target: { value: String(Number(value) - 1) } })}
      disabled={minusDisabled}
      aria-label="decrease"
    >
      -
    </button>
    <button
      onClick={() => onChange({ target: { value: String(Number(value) + 1) } })}
      aria-label="increase"
    >
      +
    </button>
    {unitRight && <span>{unitRight}</span>}
    {message && <div>{message}</div>}
  </div>
);

// Mock Tab component
export const Tab = ({ tabs, activeTab, onChange }: any) => (
  <div data-testid="tab-component">
    {tabs.map((tab: any) => (
      <button
        key={tab.value}
        className={activeTab === tab.value ? 'active' : ''}
        onClick={() => onChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

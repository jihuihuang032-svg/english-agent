'use client';

import { Scenario } from '@/types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario | null;
  onSelect: (scenario: Scenario) => void;
}

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  onSelect,
}: ScenarioSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">选择练习场景</h2>
      <div className="grid grid-cols-2 gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200
              flex flex-col items-center text-center
              ${
                selectedScenario?.id === scenario.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }
            `}
          >
            <span className="text-3xl mb-2">{scenario.icon}</span>
            <span className="text-sm font-medium text-gray-800">
              {scenario.name}
            </span>
          </button>
        ))}
      </div>
      {selectedScenario && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">{selectedScenario.description}</p>
        </div>
      )}
    </div>
  );
}

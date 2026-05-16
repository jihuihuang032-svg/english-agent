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
      <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">选择练习场景</h2>
      <div className="grid grid-cols-2 gap-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`
              p-4 rounded-2xl border transition-all duration-300
              flex flex-col items-center text-center
              active:scale-95
              ${
                selectedScenario?.id === scenario.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg shadow-blue-500/20'
                  : 'border-gray-100 bg-white/80 backdrop-blur-sm hover:border-blue-200 hover:shadow-md hover:shadow-gray-200/50'
              }
            `}
          >
            <span className="text-3xl mb-2 drop-shadow-sm">{scenario.icon}</span>
            <span className="text-sm font-medium text-gray-700">
              {scenario.name}
            </span>
          </button>
        ))}
      </div>
      {selectedScenario && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-600">{selectedScenario.description}</p>
        </div>
      )}
    </div>
  );
}

import { forwardRef, useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { useState } from "react";
import symptomsList from "@/lib/symptoms-list";

interface MedicalConditionInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onConditionSelected: (condition: string) => void;
}

export default forwardRef<HTMLInputElement, MedicalConditionInputProps>(
  function MedicalConditionInput({ onConditionSelected, ...props }, ref) {
    const [conditionSearchInput, setConditionSearchInput] = useState("");
    const [hasFocus, setHasFocus] = useState(false);

    const conditions = useMemo(() => {
      if (!conditionSearchInput.trim()) return [];

      const searchWords = conditionSearchInput.split(" ");

      return symptomsList
        .map((condition) => `${condition.Name}`)
        .filter(
          (condition) =>
            condition.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
            searchWords.every((word) =>
              condition.toLowerCase().includes(word.toLowerCase()),
            ),
        );
    }, [conditionSearchInput]);

    return (
      <div>
        <Input
          placeholder="Search for a medical condition"
          type="search"
          value={conditionSearchInput}
          onChange={(e) => setConditionSearchInput(e.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...props}
          ref={ref}
        />
        {conditionSearchInput.trim() && hasFocus && (
          <div className="absolute z-20 divide-y rounded-b-lg border-x border-b bg-background shadow-xl">
            {!conditions.length && <p className="p-3">No results found.</p>}
            {conditions.map((condition) => (
              <button
                key={condition}
                className="block p-2 text-start"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onConditionSelected(condition);
                  setConditionSearchInput("");
                }}
              >
                {condition}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

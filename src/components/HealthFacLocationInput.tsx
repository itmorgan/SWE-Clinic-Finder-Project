import { forwardRef, useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { useState } from "react";

type Clinic =
  | {
      id: string;
      lat: number;
      lng: number;
      name: string;
      phone_number: string | null;
      postal_code: string;
      block_no: string | null;
      floor_no: string | null;
      unit_no: string | null;
      street_name: string | null;
      building_name: string | null;
      address: string;
    }[]
  | null;

interface LocationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  clinicsList: Clinic;
  onLocationSelected: (location: {
    id: string;
    lat: number;
    lng: number;
    name: string;
    phone_number: string | null;
    postal_code: string;
    block_no: string | null;
    floor_no: string | null;
    unit_no: string | null;
    street_name: string | null;
    building_name: string | null;
    address: string;
  }) => void;
}

export default forwardRef<HTMLInputElement, LocationInputProps>(
  function LocationInput({ onLocationSelected, clinicsList, ...props }, ref) {
    const [locationSearchInput, setLocationSearchInput] = useState("");
    const [hasFocus, setHasFocus] = useState(false);

    const locations = useMemo(() => {
      if (!locationSearchInput.trim()) return [];

      const searchWords = locationSearchInput.split(" ");

      if (!clinicsList) return [];

      return clinicsList
        .filter(
          (clinic) =>
            clinic.name.toLowerCase().includes(searchWords[0].toLowerCase()) &&
            searchWords.every((word) =>
              `${clinic.name}, ${clinic.address}`
                .toLowerCase()
                .includes(word.toLowerCase()),
            ),
        )
        .slice(0, 5);

      //   return clinicsList
      //     .map((clinic) => `${clinic.name}, ${clinic.address}`)
      //     .filter(
      //       (clinic) =>
      //         clinic.toLowerCase().includes(searchWords[0].toLowerCase()) &&
      //         searchWords.every((word) =>
      //           clinic.toLowerCase().includes(word.toLowerCase()),
      //         ),
      //     )
      //     .slice(0, 5);
    }, [locationSearchInput]);

    return (
      <div>
        <Input
          placeholder="Search for a location"
          type="search"
          value={locationSearchInput}
          onChange={(e) => setLocationSearchInput(e.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...props}
          ref={ref}
        />
        {locationSearchInput.trim() && hasFocus && (
          <div className="absolute z-20 max-w-fit divide-y rounded-b-lg border-x border-b bg-background shadow-xl">
            {!locations.length && <p className="p-3">No results found.</p>}
            {locations.map((location) => (
              <button
                key={location.address}
                className="block w-full p-2 text-start"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onLocationSelected(location);
                  setLocationSearchInput("");
                }}
              >
                {`${location.name}, ${location.address}`}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

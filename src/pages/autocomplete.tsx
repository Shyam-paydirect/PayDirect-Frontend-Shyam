import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';

export interface CountryOption {
  code: string;
  name: string;
}

interface CountryCodeDropdownProps {
  value: string;                              // the selected code (e.g. "IN")
  options: CountryOption[];                   // full list of { name, code }
  onSelect: (option: CountryOption | null) => void;           // called with the code only
  error?: boolean;
  helperText?: string;
  title: string;
}

const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({
  value,
  options,
  onSelect,
  error = false,
  helperText = '',
  title
}) => {
  // keep a local inputValue so we can type freely, then on select push back only the code
  const [inputValue, setInputValue] = useState(value);

  // if the parent clears or sets a code, sync it back here
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Autocomplete<CountryOption, false, false, true>
      freeSolo
      fullWidth
      options={options}
      // show "Name — CODE" in the dropdown
      getOptionLabel={(opt) =>
        typeof opt === "string"
          ? opt                   // when inputValue is a string, show it raw
          : `${opt.name} — ${opt.code}`
      }      // control the displayed text
      inputValue={inputValue}
      onInputChange={(_, newInput, reason) => {
        setInputValue(newInput);
        // if user is typing instead of selecting, clear the saved code
        if (reason === 'input') onSelect(null);
      }}
      // when they pick one of the options…
      onChange={(_, option) => {
        if (option && typeof option !== "string") {
          setInputValue(option.code);
          onSelect(option);
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={title}
          error={error}
          helperText={helperText}
        />
      )}
      // only match against name or code
      filterOptions={(opts, state) =>
        opts.filter(o =>
          o.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
          o.code.toLowerCase().includes(state.inputValue.toLowerCase())
        )
      }
    />
  );
};

export default CountryCodeDropdown;

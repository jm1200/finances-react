import { useState } from "react";

function handleValidation(value, regex) {
  if (value && regex && value.match(regex)) return true;
  return false;
}

export default function useInput(name, defaultValue, regex) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setValue(e.target.value);
    setError(null);
  }
  function handleBlur() {
    handleValidate();
  }
  function handleValidate() {
    const valid = handleValidation(value, regex);
    setError(!valid);
    return valid;
  }

  function resetInput() {
    setValue("");
  }

  return {
    props: {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      error
    },
    validate: handleValidate,
    resetInput
  };
}

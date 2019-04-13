import { useState } from "react";

function flatten(array) {
  let obj = {};
  array.forEach(item => (obj[item.props.name] = item.props.value));
  return obj;
}

export default function useSubmit(inputs, success) {
  const [errorItems, setErrorItems] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const errorItems = inputs.filter(input => !input.validate());
    setErrorItems(errorItems);
    if (errorItems && errorItems.length === 0) {
      success(flatten(inputs));
    }
  }

  return {
    props: { onSubmit: handleSubmit },
    errorItems
  };
}

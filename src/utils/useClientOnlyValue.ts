import { useState, useEffect } from "react";

export function useClientOnlyValue(initialValue: any, clientValue: any) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(clientValue);
  }, [clientValue]);

  return value;
} 
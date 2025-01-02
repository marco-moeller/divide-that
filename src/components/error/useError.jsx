import { useState } from "react";

function useError() {
  const [error, setError] = useState(null);

  return { error, setError };
}

export default useError;

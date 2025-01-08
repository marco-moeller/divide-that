import { useState } from "react";

function useError(message = null) {
  const [error, setError] = useState(message);

  return { error, setError };
}

export default useError;

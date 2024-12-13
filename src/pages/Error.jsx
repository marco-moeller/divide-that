import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <main>
      <h1>Page not found!</h1>
    </main>
  );
}

export default Error;

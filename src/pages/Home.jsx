import { NavLink } from "react-router-dom";
import SlideShow from "../components/home/SlideShow";

function Home() {
  return (
    <main className="home">
      {" "}
      <section>
        <img src="icon-192.png" alt="logo" className="home-logo" />
        <h1 className="title">Divide That!</h1>{" "}
        <p className="subtitle">
          Split expenses easily with friends, family, and groups!
        </p>
      </section>
      <SlideShow />
      <p className=" login-link">
        {"Already registered? "}
        <NavLink to="/login" className="green">
          Login here.
        </NavLink>
      </p>
      <p className=" register-link">
        {"No Account yet? "}
        <NavLink to="/register" className="green">
          Register for free.
        </NavLink>
      </p>
    </main>
  );
}

export default Home;

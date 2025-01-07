import { NavLink } from "react-router-dom";
import BackButton from "../components/layout/BackButton";

function About() {
  return (
    <main className="about">
      <BackButton />
      <h2 className="title">About Divide That</h2>
      <NavLink to="/privacypolicy">Privacy Policy</NavLink>
      <NavLink to="/tos">Terms Of Servive</NavLink>
      <NavLink to="/impressum">Legal Notice</NavLink>
      <NavLink to="/disclaimer">Disclaimer</NavLink>
    </main>
  );
}

export default About;

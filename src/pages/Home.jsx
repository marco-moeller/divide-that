import { NavLink } from "react-router-dom";

function Home() {
  return (
    <main className="home">
      {" "}
      <section>
        <h2 className="title">Divide That!</h2>{" "}
        <p className="subtitle">
          Split expenses easily with friends, family, and groups!
        </p>
      </section>
      <section className="intro">
        <p className="intro-text">
          Ever wondered how much you owe or are owed after a group hangout?
          Divide That! helps you keep track of shared expenses.
        </p>
      </section>
      <section className="features">
        <div className="feature">
          <h3 className="feature-title">Track Expenses</h3>
          <p>
            Quickly add and track all expenses to see how much each person owes.
          </p>
        </div>
        <div className="feature">
          <h3 className="feature-title">Automatic Split Calculation</h3>
          <p>Automatically calculate the share for each person in the group.</p>
        </div>
        <div className="feature">
          <h3 className="feature-title">Settle Up</h3>
          <p>
            Easily settle the balance with any of your group members or friends.
          </p>
        </div>
      </section>
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

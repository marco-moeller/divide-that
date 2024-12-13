import BackButton from "../components/layout/BackButton";

function Impressum() {
  return (
    <main className="impressum">
      <BackButton />
      <h2 className="title">Legal Notice</h2>
      <p>
        Responsible for the content of this website in accordance with § 5 DDG:
      </p>

      <h3>Contact Information</h3>
      <p>
        <strong>Marco Möller</strong>{" "}
      </p>

      <p> Heilingen 6, 07407 Uhlstädt-Kirchhasel</p>

      <p>
        {" "}
        Email:{" "}
        <a href="mailto:dividethat.info@gmail.com">dividethat.info@gmail.com</a>
      </p>

      <h3>Liability for Links</h3>
      <p>
        Our website may contain links to external websites. We are not
        responsible for the content of these websites and disclaim any liability
        for them. The operators of the linked pages are solely responsible for
        their content.
      </p>

      <h3>Copyright</h3>
      <p>
        All content on this website, including text, images, and graphics, is
        protected by copyright laws. Unauthorized use or reproduction is
        prohibited.
      </p>
      <p>
        {" "}
        <a href="https://marcomoeller.net/" target="_blank">
          © Marco Moeller
        </a>{" "}
        - {new Date().getFullYear()} - All rights reserved
      </p>
    </main>
  );
}

export default Impressum;

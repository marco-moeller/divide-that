function Impressum() {
  return (
    <main className="impressum">
      <h2 className="title">Impressum</h2>
      <p>
        Responsible for the content of this website in accordance with § 5 TMG:
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

      <h3>Disclaimer</h3>
      <p>
        The information on this website is provided for general informational
        purposes only. While we strive to ensure the accuracy of the information
        presented, we assume no responsibility for errors, omissions, or
        outdated content.
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
      <p>© Marco Moeller - {new Date().getFullYear()} - All rights reserved</p>
    </main>
  );
}

export default Impressum;

import BackButton from "../components/layout/BackButton";

function PrivacyPolicy() {
  return (
    <main className="privacy-policy">
      <BackButton />
      <h2 className="title">Privacy Policy</h2>
      <p>Last updated: 13.12.2024</p>

      <p>
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your information when you visit our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li>
          Personal information (e.g., name, email address) when voluntarily
          provided by you.
        </li>
        <li>Cookies and similar tracking technologies.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information for the following purposes:</p>
      <ul>
        <li>
          To display personalized advertisements via third-party services like
          Google AdSense.
        </li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        This website does not use cookies directly. However, third-party
        services like Google Ads may use cookies to display personalized
        advertisements.
      </p>
      <p>
        For more information on how Google uses cookies, please visit their{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank">
          Ads Policy
        </a>
        .
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We use third-party services like Google AdSense for advertising. These
        services may collect and use data according to their own privacy
        policies.
      </p>
      <p>
        Learn more about{" "}
        <a
          href="https://support.google.com/adsense/answer/1348695"
          target="_blank"
        >
          Google AdSense policies
        </a>
        .
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal
        information. To exercise these rights, please contact us at{" "}
        <a href="mailto:dividethat.info@gmail.com">dividethat.info@gmail.com</a>
        .
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated revision date.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, you can contact us at:
      </p>
      <p>
        Email:{" "}
        <a href="mailto:dividethat.info@gmail.com">dividethat.info@gmail.com</a>
      </p>
    </main>
  );
}

export default PrivacyPolicy;

import Logo from "../../images/logo.png"
import Image from "next/image";

function AuthHeader() {
    return (
        <section className="logo-container">
        <Image src={Logo} alt="logo" />
        {/* <h2>Taesty</h2> */}
      </section>
      );
}

export default AuthHeader;
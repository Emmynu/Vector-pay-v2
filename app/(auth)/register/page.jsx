"use client"
import Image from "next/image";
import Logo from "../../images/logo.png"
import "../../styles/auth.css"

function Register() {
    return ( 
        <main className="auth-container">
            {/* logo section */}
            <section>
                <Image src={Logo} width={50} height={50} alt="Logo"/>
                <h2>VectorPay</h2>
            </section>
            <section>
                <article>
                    <h2>Create a VectorPay Account</h2>
                    <p>Set up your account in minutes.</p>
                </article>
                {/* form */}
                <form >
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" placeholder="yourname@example.com"/>
                    <button>Next</button>
                </form>
            </section>
        </main>
     );
}

export default Register;
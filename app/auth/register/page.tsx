import CredentialsAuth from "../../components/auth/credentials";
import GitHubAuth from "../../components/auth/github";
import GoogleAuth from "../../components/auth/google";
import "../../styles/auth.css"


function AuthPage() {
    
    return ( 
      <main className="main-form-container">
        <CredentialsAuth />
        <h3 className="mt-5 font-bold text-center">OR</h3>
        <section className="auth-container ">
          <GoogleAuth/>
          <GitHubAuth />
        </section>
      </main>
     );
}

export default AuthPage;
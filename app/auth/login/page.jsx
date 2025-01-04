import GitHubAuth from "../../components/auth/github";
import GoogleAuth from "../../components/auth/google";
import LoginAuth from "../../components/auth/Login";
import "../../styles/auth.css"


function AuthPage() {
    
    return ( 
      <main className="main-form-container">
        <LoginAuth />
        <h3 className="mt-5 font-bold text-center">OR</h3>
        <section className="auth-container ">
          <GoogleAuth/>
          <GitHubAuth />
        </section>
    </main>
     );
}

export default AuthPage;
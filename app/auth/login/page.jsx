import GitHubAuth from "../../components/auth/github";
import GoogleAuth from "../../components/auth/google";
import LoginAuth from "../../components/auth/Login";



function AuthPage() {
    
    return ( 
      <>
        <LoginAuth />
        <GoogleAuth/>
        <GitHubAuth />
      </>
     );
}

export default AuthPage;
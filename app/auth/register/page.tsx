import CredentialsAuth from "../../components/auth/credentials";
import GitHubAuth from "../../components/auth/github";
import GoogleAuth from "../../components/auth/google";



function AuthPage() {
    
    return ( 
      <>
        <CredentialsAuth />
        <GoogleAuth/>
        <GitHubAuth />
      </>
     );
}

export default AuthPage;
from google_auth_oauthlib.flow import InstalledAppFlow
import os.path
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]



def main():
    creds = None

    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json")
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:

            flow =  InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)


        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            tkn_path = os.path.join(current_dir, "token.json")
            with open(tkn_path,  "w") as f:
                f.write(creds.to_json())

        except:
            pass
    print("Successful")


if __name__ == "__main__":
    main()

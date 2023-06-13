import GoogleLoginButton from '../components/authentication/GoogleLoginButton';

export default function HomeLoggedOut() {
  return (
    <div>
      Welcome, non-user
      <GoogleLoginButton />
    </div>
  );
}

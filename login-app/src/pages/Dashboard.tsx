import { useAuth } from "../auth/AuthProvider";
import hannah from "../assets/hannah-montana.png";

export default function Dashboard() {
  const { user, signOutUser } = useAuth();

  if (user) {
    const created = user.metadata.creationTime;
    const lastLogin = user.metadata.lastSignInTime;

    console.log("Criado em:", created);
    console.log("Último login:", lastLogin);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Bem-vindo(a) {user?.email}</h1>
      <button onClick={() => signOutUser()}>Sair</button>
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { sendVerificationCodeEmail } from "../services/emailService";

type PendingLogin = {
  email: string;
  password: string;
} | null;

type AuthContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  pendingLogin: PendingLogin;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ requiresVerification: boolean }>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyLoginCode: (code: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  clearPendingLogin: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Gera código de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingLogin, setPendingLogin] = useState<PendingLogin>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Só considera logado se o email foi verificado
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Envia email de verificação
      await sendEmailVerification(userCredential.user);
      // Faz logout até o usuário verificar o email
      await signOut(auth);
    } catch (err: any) {
      setAuthError(err.message || "Erro ao criar usuário");
      throw err;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ requiresVerification: boolean }> => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verifica se o email foi confirmado
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error("Por favor, verifique seu email antes de fazer login. Cheque sua caixa de entrada.");
      }

      // Gera código de verificação e salva no Firestore
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      await setDoc(doc(db, "loginCodes", userCredential.user.uid), {
        code,
        expiresAt,
        createdAt: serverTimestamp(),
      });

      // Envia email com o código usando EmailJS
      await sendVerificationCodeEmail(email, code);
      
      // Guarda credenciais temporariamente para completar login após verificação
      setPendingLogin({ email, password });
      
      // Faz logout temporário até verificar o código
      await signOut(auth);
      
      return { requiresVerification: true };
    } catch (err: any) {
      setAuthError(err.message || "Erro ao entrar");
      throw err;
    }
  };

  const verifyLoginCode = async (code: string): Promise<boolean> => {
    if (!pendingLogin) {
      throw new Error("Nenhum login pendente");
    }

    try {
      // Faz login novamente para pegar o UID
      const userCredential = await signInWithEmailAndPassword(auth, pendingLogin.email, pendingLogin.password);
      const uid = userCredential.user.uid;

      // Busca o código salvo
      const codeDoc = await getDoc(doc(db, "loginCodes", uid));
      
      if (!codeDoc.exists()) {
        await signOut(auth);
        throw new Error("Código expirado ou inválido");
      }

      const data = codeDoc.data();
      const expiresAt = data.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);

      if (new Date() > expiresAt) {
        await deleteDoc(doc(db, "loginCodes", uid));
        await signOut(auth);
        throw new Error("Código expirado");
      }

      if (data.code !== code) {
        await signOut(auth);
        throw new Error("Código incorreto");
      }

      // Código válido - remove do Firestore
      await deleteDoc(doc(db, "loginCodes", uid));
      
      // Limpa o pending login
      setPendingLogin(null);
      
      // Atualiza o user no state
      setUser(userCredential.user);
      
      return true;
    } catch (err: any) {
      setAuthError(err.message || "Erro ao verificar código");
      throw err;
    }
  };

  const clearPendingLogin = () => {
    setPendingLogin(null);
  };

  const signOutUser = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
      setPendingLogin(null);
    } catch (err: any) {
      setAuthError(err.message || "Erro ao sair");
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setAuthError(err.message || "Erro ao resetar senha");
      throw err;
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        authError, 
        pendingLogin,
        signUp, 
        signIn, 
        signOutUser, 
        resetPassword,
        verifyLoginCode,
        resendVerificationEmail,
        clearPendingLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

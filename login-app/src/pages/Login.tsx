// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Alert from "../components/Alert";
import { Box, Text, Button, HStack, PinInput, PinInputField } from "@chakra-ui/react";
import LabelInput from "../components/input/LabelInput";

export default function Login() {
  const { signIn, pendingLogin, verifyLoginCode, clearPendingLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.requiresVerification) {
        setShowCodeInput(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("Digite o código de 6 dígitos");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await verifyLoginCode(verificationCode);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowCodeInput(false);
    setVerificationCode("");
    setError(null);
    clearPendingLogin();
  };

  // Tela de verificação de código
  if (showCodeInput || pendingLogin) {
    return (
      <Box
        maxWidth={420}
        margin="48px auto"
        padding={10}
        border="1px solid"
        borderColor="orange.400"
        borderRadius={8}
        boxShadow="lg"
      >
        <Text
          fontSize="2xl"
          mb="2"
          fontWeight="bold"
          color="rgba(223, 14, 160, 1)"
          textAlign="center"
        >
          Verificação de Segurança
        </Text>
        <Text fontSize="sm" color="gray.600" textAlign="center" mb={6}>
          Enviamos um código de 6 dígitos para o seu email. Digite-o abaixo para continuar.
        </Text>

        <HStack justifyContent="center" mb={6}>
          <PinInput
            size="lg"
            value={verificationCode}
            onChange={setVerificationCode}
            otp
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>

        <Button
          onClick={handleVerifyCode}
          isLoading={loading}
          width="100%"
          colorScheme="pink"
          mb={4}
          isDisabled={verificationCode.length !== 6}
        >
          Verificar Código
        </Button>

        <Alert message={error} />

        <Text
          fontSize="sm"
          color="gray.500"
          textAlign="center"
          mt={4}
          cursor="pointer"
          _hover={{ color: "pink.500" }}
          onClick={handleBackToLogin}
        >
          ← Voltar para o login
        </Text>
      </Box>
    );
  }

  return (
    <Box
      maxWidth={420}
      margin="48px auto"
      padding={10}
      border="1px solid"
      borderColor="orange.400"
      borderRadius={8}
      boxShadow="lg"
    >
      <Text
        fontSize="2xl"
        mb="4"
        fontWeight="bold"
        color="rgba(223, 14, 160, 1)"
        textAlign="center"
      >
        Bem-vindo
      </Text>
      <form onSubmit={handleSubmit}>
        <LabelInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LabelInput
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          isLoading={loading}
          width="100%"
          colorScheme="pink"
          mt={4}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <Alert message={error} />

      <Text style={{ marginTop: 20, fontSize: 14, opacity: 0.8 }}>
        Não tem uma conta?{" "}
        <Link to="/register" style={{ color: "rgba(223, 14, 160, 1)" }}>
          Criar conta
        </Link>
      </Text>
    </Box>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Alert from "../components/Alert";
import { Box, Text, Button } from "@chakra-ui/react";
import LabelInput from "../components/input/LabelInput";

export default function Register() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await signUp(email, password);
      setSuccessMessage(
        "Conta criada com sucesso! Verifique seu email para confirmar sua conta antes de fazer login."
      );
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setLocalError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
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
        Criar Conta
      </Text>

      {successMessage ? (
        <Box>
          <Box
            bg="green.100"
            border="1px solid"
            borderColor="green.400"
            borderRadius={8}
            p={4}
            mb={4}
          >
            <Text color="green.700" textAlign="center">
              {successMessage}
            </Text>
          </Box>
          <Text textAlign="center" mt={4}>
            <Link to="/login" style={{ color: "rgba(223, 14, 160, 1)", fontWeight: "bold" }}>
              Ir para o Login
            </Link>
          </Text>
        </Box>
      ) : (
        <>
          <form onSubmit={handleRegister}>
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
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <Alert message={localError} />

          <Text style={{ marginTop: 20, fontSize: 14, opacity: 0.8 }}>
            Já tem uma conta?{" "}
            <Link to="/login" style={{ color: "rgba(223, 14, 160, 1)" }}>
              Faça login
            </Link>
          </Text>
        </>
      )}
    </Box>
  );
}

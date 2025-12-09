// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Alert from "../components/Alert";
import { Box, Text, Button } from "@chakra-ui/react";
import LabelInput from "../components/input/LabelInput";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err.code);
      setError("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

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
    </Box>
  );
}

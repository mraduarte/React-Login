import React from "react";
import { Link } from "react-router-dom";

export default function PublicHome() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#111",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Bem-vinda, Maria! 👋</h1>
      <p style={{ marginBottom: 40, opacity: 0.8 }}>
        Esta é uma página pública. Faça login ou crie uma conta.
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        <Link
          to="/login"
          style={{
            background: "#2196f3",
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Login
        </Link>

        <Link
          to="/register"
          style={{
            background: "#4caf50",
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Criar Conta
        </Link>
      </div>
    </div>
  );
}

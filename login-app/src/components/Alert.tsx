export default function Alert({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: "#ffe5e5",
        color: "#900",
        padding: 12,
        borderRadius: 6,
        margin: "8px 0",
      }}
    >
      {message}
    </div>
  );
}

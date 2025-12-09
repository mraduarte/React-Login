import { Box, Text, Input, Button } from "@chakra-ui/react";

const LabelInput = ({
  label,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <Box mt={2}>
    <Text mb="1">{label}</Text>
    <Input type={type} value={value} onChange={onChange} required={required} />
  </Box>
);
export default LabelInput;
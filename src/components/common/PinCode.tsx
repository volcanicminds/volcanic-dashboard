import { PIN_LENGTH } from "@/utils/constants";
import { Box, Stack } from "@mui/material";
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

interface PinCodeProps {
  name: string;
  onChange: (name: string, value: string) => void;
  isLoading: boolean;
  type?: string;
  onSubmit?: () => Promise<void>;
  fontWeight?: number;
  fontSize?: string;
}

export default function PinCode({
  name,
  onChange,
  isLoading,
  type = "password",
  onSubmit,
  fontWeight = 700,
  fontSize = "30px",
}: PinCodeProps) {
  const [pin, setPin] = useState("");

  const id = useMemo(() => `pin-input-${name}`, [name]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      // Verifica che sia un numero
      let newPin = pin.split("");

      // Aggiorna il carattere alla posizione corrente
      newPin[index] = value;

      // Unisci e limita la lunghezza del PIN a PIN_LENGTH
      newPin = newPin.join("").substring(0, PIN_LENGTH).split("");

      setPin(newPin.join(""));

      // Focus sul prossimo input se non è l'ultimo
      if (value && index < PIN_LENGTH - 1) {
        const nextInput = document.getElementById(
          `${id}-${index + 1}`
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      const prevInput = document.getElementById(
        `${id}-${index - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
    if (onSubmit && event.key === "Enter" && pin.length <= PIN_LENGTH) {
      onSubmit();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    if (/^\d{4,6}$/.test(pasteData)) {
      // Verifica che siano esattamente 6 cifre
      setPin(pasteData);
    }
  };

  useEffect(() => {
    onChange(name, pin);
  }, [pin, onChange, name]);

  return (
    <Stack direction="row" gap={1.5}>
      {Array.from({ length: PIN_LENGTH }).map((_, index) => (
        <Box
          sx={{ aspectRatio: 1 }}
          width="calc(100% / 6)"
          key={`${id}-${name}-${index}`}
        >
          <input
            key={index}
            id={`${id}-${index}`}
            type={type}
            disabled={isLoading}
            aria-label={`Pin input #${index}`}
            maxLength={1}
            value={pin[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            style={{
              textAlign: "center",
              width: "100%",
              height: "100%",
              fontWeight,
              fontSize,
            }}
          />
        </Box>
      ))}
    </Stack>
  );
}

import { AttachFile } from "@mui/icons-material";
import { MuiFileInput } from "mui-file-input";

export default function FileInput({
  file,
  onChange,
  inputProps,
  placeholder,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  inputProps?: any;
  placeholder?: string;
}) {
  return (
    <MuiFileInput
      value={file}
      inputProps={inputProps}
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <AttachFile sx={{ color: (theme) => theme.palette.common.white }} />
        ),
      }}
    />
  );
}

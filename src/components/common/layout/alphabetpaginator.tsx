import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";

export interface AlphabetPaginatorInterface {
  filterByLetter: (value: any) => void;
  letterSelected: string;
}

export default function AlphabetPaginator({
  filterByLetter,
  letterSelected,
}: AlphabetPaginatorInterface) {
  const alphabet = [
    "#",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "Y",
    "Z",
  ];

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        style={{ maxWidth: "70%", margin: "20px auto 0px" }}
      >
        <Typography
          variant="subtitle1"
          fontSize={15}
          onClick={() => filterByLetter("all")}
          style={{
            cursor: "pointer",
            fontWeight: letterSelected === "all" ? "bold" : "300",
          }}
        >
          {t("all")}
        </Typography>
        {alphabet?.map((letter) => (
          <div
            style={{
              cursor: "pointer",
              fontWeight: letter === letterSelected ? "bold" : "300",
            }}
            key={letter}
            onClick={() => filterByLetter(letter)}
          >
            {letter}
          </div>
        ))}
      </Stack>
    </>
  );
}

import * as XLSX from "xlsx";

export const ALLOWED_COLUMNS = [
  "name",
  "type",
  "length",
  "beam",
  "draft",
  "gross_tonnage",
  "net_tonnage",
  "year_built",
  "classification",
  "flag",
];

export const REQUIRED_COLUMNS = ["name"];

export const MAX_FILE_SIZE_MB = 5;
export const PREVIEW_ROW_COUNT = 4;

export const parseFile = async (file) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "csv") {
    const text = await file.text();
    const workbook = XLSX.read(text, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  if (ext === "xlsx") {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  throw new Error("Unsupported file type");
};

export const validateRows = (rows) => {
  const validRows = [];
  const invalidRows = [];

  rows.forEach((row, index) => {
    const errors = [];

    REQUIRED_COLUMNS.forEach((col) => {
      if (!row[col] || String(row[col]).trim() === "") {
        errors.push(`"${col}" is required`);
      }
    });

    if (errors.length) {
      invalidRows.push({
        rowNumber: index + 2, // header offset
        errors,
        rowData: row,
      });
    } else {
      validRows.push(row);
    }
  });

  return { validRows, invalidRows };
};

export const exportInvalidRows = (rows) => {
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((r) => ({
      row: r.rowNumber,
      errors: r.errors.join(", "),
      ...r.rowData,
    })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invalid Rows");

  XLSX.writeFile(workbook, "invalid-ships.xlsx");
};

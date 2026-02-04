import { Stack, CircularProgress, Box } from "@mui/material";
import { useState } from "react";

import ImportHeader from "./importFileComponents/ImportHeader";
import FileUploader from "./importFileComponents/FileUploader";
import FilePreview from "./importFileComponents/FilePreview";
import ValidationSummary from "./importFileComponents/ValidationSummary";
import InvalidRowsTable from "./importFileComponents/InvalidRowsTable";
import ImportActions from "./importFileComponents/ImportActions";

import {
  parseFile,
  validateRows,
  exportInvalidRows,
  PREVIEW_ROW_COUNT,
} from "./utils";
import { useSelector } from "react-redux";
import PaginatedAutocomplete from "components/@extended/PaginatedAutocomplete";
import { fetchClientsOptionsApi } from "api/shipyard";
import Section from "./importFileComponents/Section";
import ImportLayout from "./importFileComponents/ImportLayout";
import ImportInstructions from "./importFileComponents/ImportInstructions";
import { createBulkShipApi } from "api/ship";
import { toast } from "react-toastify";

const BulkShipImportComponent = ({ onClose }) => {
  const { shipyard } = useSelector((state) => state.shipyard);
  const [company, setCompany] = useState(null);
  const [filename, setFileName] = useState(null);
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [loading, setLoading] = useState(false); // ⬅️ loading state
  const [isValidated, setIsValidated] = useState(false);
  const [isImported, setIsImported] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file?.name);

    // Reset all previous states
    setValidRows([]);
    setInvalidRows([]);
    setPreview([]);
    setRows([]);
    setIsValidated(false); // reset validation state
    setIsImported(false); // reset import state
    setLoading(true);

    try {
      const parsed = await parseFile(file);
      setRows(parsed);
      setPreview(parsed.slice(0, PREVIEW_ROW_COUNT));
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!rows.length) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay
      const { validRows, invalidRows } = validateRows(rows);
      setValidRows(validRows);
      setInvalidRows(invalidRows);

      setIsValidated(true); // ✅ mark as validated
      setIsImported(false); // import needs to be redone after re-upload
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!isValidated || !validRows.length) return; // safety check

    setLoading(true);

    try {
      const result = await createBulkShipApi(company.id, {
        file_name: filename,
        valid_rows: validRows,
        invalid_rows: invalidRows,
      });

      const { status, summary } = result;
      if (status === "SUCCESS") {
        toast.success(
          `Bulk import completed successfully. ${summary.success_rows} ships created.`,
        );
      } else if (status === "PARTIAL_SUCCESS") {
        toast.success(
          `Bulk import partially completed. ${summary.success_rows} created, ${summary.failed_rows} failed.`,
        );
      } else if (status === "FAILED") {
        toast.error("Bulk import failed. No ships were created.");
      }
    } catch (err) {
      console.error("Bulk ship import error", err?.response?.data);
      toast.error(
        err?.response?.data?.error?.message ||
          "Something went wrong while importing ships",
      );
    } finally {
      setIsImported(true); // ✅ mark as imported
      setLoading(false);
    }
  };

  return (
    <ImportLayout
      header={
        <Section>
          <ImportHeader shipyardName={shipyard.name} />
        </Section>
      }
      children={
        <Stack spacing={3}>
          <Section>
            <ImportInstructions
              companyName={
                company
                  ? `${company?.first_name} ${company?.last_name}`
                  : " Select Company from dropdown"
              }
            />
          </Section>

          <Section>
            <PaginatedAutocomplete
              label="Select Company"
              value={company}
              extraParams={{ shipyardId: shipyard?.id }}
              fetchOptionsApi={fetchClientsOptionsApi}
              pageSize={100}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              onChange={(option) => setCompany(option)}
            />
          </Section>

          <Section>
            <FileUploader
              disabled={!company || loading}
              onSelect={handleFile}
            />
            {loading && (
              <Box mt={2} display="flex" alignItems="center">
                <CircularProgress size={24} />
                <Box ml={2}>Processing file, please wait...</Box>
              </Box>
            )}
            <FilePreview rows={preview} />
          </Section>

          <Section>
            {validRows.length || invalidRows.length ? (
              <ValidationSummary
                valid={validRows.length}
                invalid={invalidRows.length}
              />
            ) : null}

            {invalidRows.length > 0 && (
              <InvalidRowsTable
                rows={invalidRows}
                onDownload={() => exportInvalidRows(invalidRows)}
              />
            )}
          </Section>
        </Stack>
      }
      footer={
        <ImportActions
          canValidate={!isValidated && rows.length > 0 && !loading} // only enabled if not validated
          canImport={
            isValidated && !isImported && validRows.length > 0 && !loading
          } // only enabled if validated & not yet imported
          onValidate={handleValidate}
          onImport={handleBulkImport}
          onCancel={onClose}
        />
      }
    />
  );
};

export default BulkShipImportComponent;

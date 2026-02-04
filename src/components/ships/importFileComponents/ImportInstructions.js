import {
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ALLOWED_COLUMNS, MAX_FILE_SIZE_MB } from "../utils";

const ImportInstructions = ({ companyName }) => (
  <Alert
    severity="info"
    icon={<InfoCircleOutlined />}
    sx={{ alignItems: "flex-start" }}
  >
    <AlertTitle>Instructions</AlertTitle>

    <List dense sx={{ pl: 0 }}>
      <ListItem>
        <ListItemText
          primary={
            <>
              Column Names must be <b>lowercase</b>:
              <Typography component="span" sx={{ ml: 0.5 }} color="primary">
                {ALLOWED_COLUMNS.join(", ")}
              </Typography>
            </>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={
            <>
              Only <b>"name"</b> column is required, so make sure it will be
              available against each data in the file
            </>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={
            <>
              All ships will be created against company:&nbsp;
              <b>{companyName}</b>
            </>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={`Max file size: ${MAX_FILE_SIZE_MB}MB. Split large files if needed and then process one by one.`}
        />
      </ListItem>
    </List>
  </Alert>
);

export default ImportInstructions;

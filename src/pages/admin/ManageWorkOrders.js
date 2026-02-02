import { useEffect, useState } from "react";

// material-ui
import { Grid, Typography, Stack } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import useAuth from "hooks/useAuth";
import { fetchShips } from "../../redux/features/ships/actions";
import Loader from "components/Loader";
import { fetchDockings } from "../../redux/features/dockings/actions";
import RepairDetailCard from "components/work-order/RepairCard";
import dataApi from "utils/dataApi";
import { fetchWorkOrders } from "../../redux/features/work-order/actions";
import Dropdown from "components/work-order/Dropdown";
import InfoMessage from "components/work-order/InfoMessage";
import WorkOrderTable from "components/work-order/WorkOrderTable";
import { repairOrders } from "../../redux/features/repair/actions";
import InventoryOrderTable from "components/work-order/InventoryOrderTable";
import { fetchInventories } from "../../redux/features/inventory/actions";
import DropdownDependencyInfo from "components/@extended/DropdownDependencyInfo";

const ManageWorkOrders = () => {
  const { user } = useAuth();
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedDocking, setSelectedDocking] = useState(null);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [departments, setDepartments] = useState([]);

  const dispatch = useDispatch();
  const { shipyard } = useSelector((state) => state.shipyard);
  const { dockings, status: fetchingDockings } = useSelector(
    (state) => state.docking,
  );
  const { ships, status: fetchingShips } = useSelector((state) => state.ship);
  const { workOrders, inventoryOrders } = useSelector(
    (state) => state.workOrder,
  );
  const { inventories } = useSelector((state) => state.inventory);
  const isAdminOrPM = ["ADMIN", "PROJECT_MANAGER"].includes(user?.role);
  const isForeman = user?.role === "FOREMAN";

  useEffect(() => {
    try {
      if (!user) return;

      if (isAdminOrPM) {
        (async () => {
          dispatch(
            fetchShips({
              shipyardID: user?.shipyard_id,
              queryParams: { include_client: false },
            }),
          );
          const [{ data }] = await Promise.all([
            dataApi.get("/v1/departments?include_foreman=true"),
          ]);
          dispatch(fetchInventories(user?.shipyard_id));
          setDepartments(data.departments);
        })();
      } else if (isForeman) {
        //getting work order on foreman basis. Handled on backend side
        dispatch(fetchWorkOrders());
      }
    } catch (error) {
      console.error("Error occurred while getting dockings", error);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (!selectedShip) return;

      (async () => {
        dispatch(
          fetchDockings({
            shipyardID: user?.shipyard_id,
            queryParams: `include_repairs=true&ship_id=${selectedShip?.id}`,
          }),
        );
      })();
    } catch (error) {
      console.error("Error occurred while getting dockings", error);
    }
  }, [selectedShip]);

  useEffect(() => {
    try {
      if (!selectedRepair) return;

      (async () => {
        dispatch(repairOrders(selectedRepair.id));
      })();
    } catch (error) {
      console.error("Error occurred while getting dockings", error);
    }
  }, [selectedRepair]);

  if ([fetchingDockings, fetchingShips].includes("loading")) return <Loader />;

  const renderInfoMessage = () => {
    if (!selectedShip && !_.isEmpty(ships))
      return (
        <DropdownDependencyInfo visible={!selectedShip} requiredField="SHIP" />
      );
    if (!selectedDocking && !_.isEmpty(dockings))
      return (
        <DropdownDependencyInfo
          visible={!selectedDocking}
          requiredField="DOCKING"
        />
      );
    if (!selectedRepair && !_.isEmpty(selectedDocking?.repairs))
      return (
        <DropdownDependencyInfo
          visible={!selectedRepair}
          requiredField="REPAIR"
        />
      );
  };

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: {
            xs: "h5.fontSize",
            md: "h2.fontSize",
          },
        }}
      >
        Manage WorkOrder
      </Typography>
      <></>
      {_.isEmpty(shipyard) ? (
        <></>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "16px", marginBottom: "8px" }}
        >
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Shipyard Select */}
              <Dropdown
                label="Shipyard"
                value={shipyard}
                options={[shipyard]}
                getOptionLabel={(opt) => opt?.name}
              />
              {/* Select ships */}
              {isAdminOrPM && (
                <Dropdown
                  label="Ships"
                  value={selectedShip}
                  options={ships}
                  onChange={(e) => {
                    setSelectedShip(e.target.value);
                    setSelectedDocking(null);
                    setSelectedRepair(null);
                  }}
                  getOptionLabel={(opt) => opt?.name}
                />
              )}

              {/* Dockings - only for Admin */}
              {isAdminOrPM &&
                !_.isEmpty(selectedShip) &&
                !_.isEmpty(dockings) && (
                  <Dropdown
                    label="Dockings"
                    value={selectedDocking}
                    options={dockings}
                    onChange={(e) => {
                      setSelectedDocking(e.target.value);
                      setSelectedRepair(null);
                    }}
                    getOptionLabel={(opt) => opt?.name}
                  />
                )}

              {/* Repairs - only for Admin */}
              {isAdminOrPM && !_.isEmpty(selectedDocking?.repairs) && (
                <Dropdown
                  label="Repair"
                  value={selectedRepair}
                  options={selectedDocking.repairs}
                  onChange={(e) => setSelectedRepair(e.target.value)}
                  getOptionLabel={(_, idx) => `Repair ${idx + 1}`}
                />
              )}
            </Stack>
          </Grid>
          {isAdminOrPM && (
            <Grid item xs={12}>
              <InfoMessage
                condition={!_.isEmpty(selectedShip) && _.isEmpty(dockings)}
                name={selectedShip?.name}
                entity="dockings"
                linkTo="/dashboard/dockings"
                linkText="Manage Dockings"
              />
              <InfoMessage
                condition={
                  !_.isEmpty(selectedDocking) &&
                  _.isEmpty(selectedDocking?.repairs)
                }
                name={selectedDocking?.name}
                entity="repairs"
                linkTo="/dashboard/repairs"
                linkText="Manage Repairs"
              />

              {renderInfoMessage()}
            </Grid>
          )}
          {!_.isEmpty(selectedRepair) && (
            <>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Repair Details
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                <RepairDetailCard repair={selectedRepair} />
              </Grid>
            </>
          )}

          {/* Rendering Work Orders and Inventory orders */}
          {((isAdminOrPM && !_.isEmpty(selectedRepair)) || isForeman) && (
            <>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Work Orders
                </Typography>
                <WorkOrderTable
                  lists={selectedRepair || isForeman ? workOrders : []}
                  repair={selectedRepair}
                  departments={departments}
                />
              </Grid>

              {isAdminOrPM && (
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Inventory Orders
                  </Typography>
                  <InventoryOrderTable
                    lists={selectedRepair ? inventoryOrders : []}
                    showTitle={false}
                    hideSYName={true}
                    repair={selectedRepair}
                    departments={departments}
                    inventories={inventories}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      )}
    </>
  );
};

export default ManageWorkOrders;

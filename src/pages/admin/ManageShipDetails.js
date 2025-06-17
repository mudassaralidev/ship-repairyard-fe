import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Skeleton, Stack, Button, Grid, Collapse } from '@mui/material';
import MainCard from 'components/MainCard';
import { useParams } from 'react-router-dom';
import { fetchShip } from '../../redux/features/ships/actions';
import { useDispatch, useSelector } from 'react-redux';
import ManageShips from './ManageShips';
import ManageDockings from './ManageDockings';
import DockingModal from 'components/docking/DokcingModal';
import useAuth from 'hooks/useAuth';
import { getAvailableDockingPlaces } from 'api/dockingPlaces';
import { getDockingNamesForRepair } from 'api/docking';
import dataApi from 'utils/dataApi';
import { fetchInventoriesApi } from 'api/shipyard';
import ManageRepairs from './ManageRepairs';
import RepairModal from 'components/repair/RepairModal';
import WorkOrderTable from 'components/work-order/WorkOrderTable';
import InventoryOrderTable from 'components/work-order/InventoryOrderTable';
import { PlusOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const ShipDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { ship, error, status } = useSelector((state) => state.ship);
  const { shipyard } = useSelector((state) => state.shipyard);
  const [dockingModal, setDockingModal] = useState(false);
  const [dockingPlaces, setDockingPlaces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dockingNames, setDockingNames] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedDocking, setSelectedDocking] = useState(null);
  const [repairModal, setRepairModal] = useState(false);
  const [loading, setLoading] = useState([true]);
  const [selectedDockingDetails, setSelectedDockingDetails] = useState(null);
  const detailsEndRef = useRef(null);

  const toggleDockingDetails = (dockingId) => {
    setSelectedDockingDetails((prev) => (prev === dockingId ? null : dockingId));
  };

  useEffect(() => {
    if (!user) return;
    const { shipyard_id } = user;
    dispatch(fetchShip(id));
    (async () => {
      const dockingData = await getAvailableDockingPlaces(shipyard_id);
      setDockingPlaces(dockingData);
      const [data, { data: departsData }, inventories] = await Promise.all([
        getDockingNamesForRepair(shipyard_id),
        dataApi.get('/v1/departments?include_foreman=true'),
        fetchInventoriesApi(shipyard_id)
      ]);
      setDepartments(departsData.departments);
      setDockingNames(data);
      setInventories(inventories);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedDockingDetails && detailsEndRef.current) {
      // Delay scroll to allow Collapse animation to complete
      const timeout = setTimeout(() => {
        detailsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300); // match Collapse's transition time

      return () => clearTimeout(timeout);
    }
  }, [selectedDockingDetails]);

  if (status === 'loading' || loading) return <Skeleton variant="rectangular" height={400} sx={{ m: 2 }} />;
  if (!ship || error) return <Typography>No data found</Typography>;

  return (
    <MainCard content={false}>
      <Box p={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
            Ship: {ship.name}
          </Typography>
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setDockingModal(!dockingModal)}>
            Create Docking
          </Button>
        </Stack>

        <ManageShips showCreateBtn={false} shipData={ship} dockedPlaces={dockingPlaces} />
      </Box>

      <Grid container spacing={2}>
        {ship.dockings?.map((docking, dockingIndex) => {
          const isOpen = selectedDockingDetails === docking.id;
          return (
            <Grid item xs={12} key={docking.id}>
              <Box p={2} borderRadius={2} sx={{ bgcolor: 'primary.lighter', boxShadow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h5">🚢 Docking #{dockingIndex + 1}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color={isOpen ? 'error' : 'secondary'}
                      startIcon={isOpen ? <CloseOutlined /> : <EyeOutlined />}
                      onClick={() => toggleDockingDetails(docking.id)}
                    >
                      {isOpen ? 'Details' : 'Detail'}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PlusOutlined />}
                      onClick={() => {
                        setSelectedDocking(docking);
                        setRepairModal(!repairModal);
                      }}
                    >
                      Create Repair
                    </Button>
                  </Stack>
                </Stack>

                <ManageDockings ship={[ship]} shipDocking={docking} dockedPlaces={dockingPlaces} />
              </Box>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                {/* Repairs */}
                {docking.repairs?.map((repair, repairIndex) => (
                  <Box
                    key={repair.id}
                    ml={4}
                    mt={2}
                    p={2}
                    borderRadius={2}
                    sx={{
                      bgcolor: 'secondary.lighter',
                      borderLeft: '4px solid #90caf9',
                      boxShadow: 0.5
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      🛠️ Repair #{repairIndex + 1}
                    </Typography>
                    <ManageRepairs repairData={repair} departsData={departments} inventoryData={inventories} dockedName={docking} />
                    {/* Work Order */}
                    {repair.work_orders.length && (
                      <Box
                        mt={2}
                        ml={3}
                        p={2}
                        borderRadius={2}
                        sx={{
                          bgcolor: 'info.lighter',
                          borderLeft: '4px solid #1976d2'
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          📋 Work Orders
                        </Typography>
                        <WorkOrderTable
                          lists={repair.work_orders}
                          repair={repair}
                          departments={departments}
                          hideSYName={true}
                          showTitle={false}
                          showPagination={false}
                        />
                      </Box>
                    )}

                    {/* Inventory Orders */}
                    {repair.inventory_orders?.length > 0 && (
                      <Box
                        mt={2}
                        ml={3}
                        p={2}
                        borderRadius={2}
                        sx={{
                          bgcolor: 'warning.lighter',
                          borderLeft: '4px solid #ffa726'
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          📦 Inventory Orders
                        </Typography>
                        {/* <Box key={order.id} mt={1}> */}
                        <InventoryOrderTable lists={repair.inventory_orders} showPagination={false} hideSYName={true} showTitle={false} />
                        {/* </Box> */}
                      </Box>
                    )}
                  </Box>
                ))}
                <div ref={detailsEndRef}></div>
              </Collapse>
            </Grid>
          );
        })}
      </Grid>

      {dockingModal && (
        <DockingModal
          open={dockingModal}
          modalToggler={() => {
            setDockingModal(!dockingModal);
          }}
          shipyard={shipyard}
          ship={ship}
          dockingPlaces={dockingPlaces}
          removeUsedPlace={(placeId) => setDockingPlaces((preState) => preState.filter((p) => p.id !== placeId))}
        />
      )}

      {repairModal && (
        <RepairModal open={repairModal} modalToggler={() => setRepairModal(!repairModal)} shipyard={shipyard} docking={selectedDocking} />
      )}
    </MainCard>
  );
};

export default ShipDetails;

/**
 * Redux selectors for docking places state
 */

export const selectDockingPlaces = (state) => state.dockingPlaces.dockingPlaces;

export const selectSelectedDockingPlace = (state) =>
  state.dockingPlaces.dockingPlace;

export const selectDockingPlacesLoading = (state) =>
  state.dockingPlaces.loading;

export const selectDockingPlacesError = (state) => state.dockingPlaces.error;

export const selectDockingPlacesPagination = (state) =>
  state.dockingPlaces.pagination;

export const selectDockingPlacesSuccessMessage = (state) =>
  state.dockingPlaces.successMessage;

/**
 * Selector to get docking place by ID
 */
export const selectDockingPlaceById = (state, id) => {
  return (
    state.dockingPlaces.dockingPlaces.find((place) => place.id === id) || null
  );
};

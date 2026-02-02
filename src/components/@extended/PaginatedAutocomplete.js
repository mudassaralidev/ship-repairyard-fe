import React, { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import _ from "lodash";
import axios from "axios";

const LOAD_MORE_OPTION = {
  id: "__LOAD_MORE__",
  label: "Load more…",
};

const PaginatedAutocomplete = ({
  label,
  value,
  onChange,
  fetchOptionsApi,
  getOptionLabel,
  isOptionEqualToValue,
  extraParams = {},
  pageSize = 100,
  disabled = false,
  error,
  helperText,
  sx = {},
}) => {
  const cancelToken = useRef(null);

  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    options: [],
    loading: false,
    search: "",
    page: 1,
    totalPages: 1,
  });

  // Cache for fetched pages keyed by search term
  const cache = useRef({});

  const fetchOptions = async (search = "", page = 1) => {
    const cacheKey = search || "__DEFAULT__";

    // If the requested page is already cached, reuse it
    if (cache.current[cacheKey]?.[page]) {
      setState((prev) => {
        const cachedPages = Object.values(cache.current[cacheKey]).flat();
        return {
          ...prev,
          options: cachedPages,
          page,
          totalPages: cache.current[cacheKey].totalPages,
          loading: false,
        };
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      if (cancelToken.current) cancelToken.current.cancel();
      cancelToken.current = axios.CancelToken.source();

      const { options, pagination } = await fetchOptionsApi(
        cancelToken.current.token,
        { search, page, pageSize, ...extraParams },
      );

      // Initialize cache for this search if not exists
      if (!cache.current[cacheKey])
        cache.current[cacheKey] = { totalPages: pagination.totalPages };

      // Store page in cache
      cache.current[cacheKey][page] = options;
      cache.current[cacheKey].totalPages = pagination.totalPages;

      // Merge all cached pages for this search
      const allOptions = Object.values(cache.current[cacheKey])
        .filter((v) => Array.isArray(v))
        .flat();

      setState((prev) => ({
        ...prev,
        options: allOptions,
        page,
        totalPages: pagination.totalPages,
        loading: false,
      }));
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error(err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    }
  };

  /* ---------------------------------- */
  /* Initial load                        */
  /* ---------------------------------- */
  useEffect(() => {
    fetchOptions("", 1);
    return () => cancelToken.current?.cancel();
  }, []);

  /* ---------------------------------- */
  /* Debounced search                    */
  /* ---------------------------------- */
  const handleSearch = useMemo(
    () =>
      _.debounce((value) => {
        setState((prev) => ({ ...prev, search: value, page: 1 }));
        fetchOptions(value, 1);
      }, 500),
    [],
  );

  /* ---------------------------------- */
  /* Derived options (Load more)         */
  /* ---------------------------------- */
  const derivedOptions = useMemo(() => {
    if (state.search) {
      // During search, show only search results
      return state.options;
    }

    // No search → show cached default options
    const cachedPages = cache.current["__DEFAULT__"] || {};
    const cachedOptions = Object.values(cachedPages)
      .filter((v) => Array.isArray(v))
      .flat();

    // Add Load More if more pages exist
    const highestCachedPage = Math.max(
      0,
      ...Object.keys(cachedPages)
        .filter((k) => k !== "totalPages")
        .map(Number),
    );
    const totalPages = cachedPages.totalPages || 1;

    if (highestCachedPage < totalPages) {
      return [...cachedOptions, { ...LOAD_MORE_OPTION, label: "Load more…" }];
    }

    return cachedOptions;
  }, [state.search, state.options, open]);

  return (
    <Autocomplete
      sx={{ ...sx }}
      disabled={disabled}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        // Clear search results when dropdown closes
        setState((prev) => ({
          ...prev,
          search: "", // clear input value
          options: [], // ignore search results
        }));
      }}
      options={derivedOptions}
      value={value}
      loading={state.loading}
      getOptionLabel={(option) =>
        option.id === LOAD_MORE_OPTION.id
          ? option.label
          : getOptionLabel(option)
      }
      isOptionEqualToValue={isOptionEqualToValue}
      onInputChange={(e, value, reason) => {
        if (reason === "input") handleSearch(value);

        if (
          (reason === "clear" || reason === "reset") &&
          state.options.length === 0
        ) {
          // Reset search but reuse cached options if available
          setState((prev) => ({ ...prev, search: "" }));
          fetchOptions("", 1); // fetchOptions will handle cache automatically
        }
      }}
      onChange={(_, option) => onChange(option)}
      renderOption={(props, option) => {
        if (option.id === LOAD_MORE_OPTION.id) {
          return (
            <li
              {...props}
              key={option.id}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // Determine next page to fetch based on cache
                const cacheKey = state.search || "__DEFAULT__";
                const cachedPages = cache.current[cacheKey] || {};
                const highestCachedPage = Math.max(
                  0,
                  ...Object.keys(cachedPages)
                    .filter((k) => k !== "totalPages")
                    .map(Number),
                );

                const nextPage = highestCachedPage + 1;

                // Fetch next page if not already exceeding totalPages
                if (nextPage <= (cachedPages.totalPages || 1)) {
                  fetchOptions(state.search, nextPage);
                }
              }}
              style={{
                justifyContent: "center",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {state.loading ? "Loading…" : option.label}
            </li>
          );
        }

        return (
          <li {...props} key={option.id}>
            {getOptionLabel(option)}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={Boolean(error)}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {state.loading && (
                  <CircularProgress size={20} color="inherit" />
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default PaginatedAutocomplete;

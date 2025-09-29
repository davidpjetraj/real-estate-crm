"use client";

import { FormikProps } from "formik";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import { Select } from "@/components/Form/Select";
import { PropertyCategory } from "@/lib/graphql/generated/graphql";

interface Step1Props {
  formik: FormikProps<any>;
  statesData?: any;
  citiesData?: any;
  streetsData?: any;
}

const propertyCategories = [
  { value: PropertyCategory.Apartment, label: "Apartment" },
  { value: PropertyCategory.Home, label: "Home" },
  { value: PropertyCategory.Object, label: "Object" },
  { value: PropertyCategory.Office, label: "Office" },
];

export default function Step1BasicInfo({
  formik,
  statesData,
  citiesData,
  streetsData,
}: Step1Props) {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Basic Information
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the basic information about your property.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Property Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          fullWidth
          multiline
          rows={4}
          required
        />

        <FormControl fullWidth required>
          <InputLabel>Property Category</InputLabel>
          <MuiSelect
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}
            label="Property Category"
          >
            {propertyCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Location
        </Typography>

        <Select
          label="State"
          name="state_id"
          options={
            statesData?.states?.map((state: any) => ({
              value: state.id,
              label: state.name,
            })) || []
          }
          onChange={(event: any) => {
            formik.setFieldValue("state_id", event.target.value);
            // Reset dependent fields
            formik.setFieldValue("city_id", "");
            formik.setFieldValue("street_id", "");
          }}
        />

        <Select
          label="City"
          name="city_id"
          options={
            citiesData?.cities
              ?.filter((city: any) => city.state?.id === formik.values.state_id)
              .map((city: any) => ({
                value: city.id,
                label: city.name,
              })) || []
          }
          disabled={!formik.values.state_id}
          onChange={(event: any) => {
            formik.setFieldValue("city_id", event.target.value);
            // Reset dependent field
            formik.setFieldValue("street_id", "");
          }}
        />

        <Select
          label="Street (Optional)"
          name="street_id"
          options={
            streetsData?.streets
              ?.filter(
                (street: any) => street.city?.id === formik.values.city_id
              )
              .map((street: any) => ({
                value: street.id,
                label: street.name,
              })) || []
          }
          disabled={!formik.values.city_id}
        />
      </Box>
    </Box>
  );
}

"use client";

import { FormikProps } from "formik";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
} from "@mui/material";

interface Step2Props {
  formik: FormikProps<any>;
}

export default function Step2Details({ formik }: Step2Props) {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Property Details
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add detailed information about your property.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Property Specifications */}
        <Typography variant="h6">Property Specifications</Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Surface Area (m²)"
              name="surface"
              type="number"
              value={formik.values.surface}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surface && Boolean(formik.errors.surface)}
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Floor"
              name="floor"
              type="number"
              value={formik.values.floor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.floor && Boolean(formik.errors.floor)}
              fullWidth
              inputProps={{ step: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Number of Floors"
              name="number_of_floors"
              type="number"
              value={formik.values.number_of_floors}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.number_of_floors &&
                Boolean(formik.errors.number_of_floors)
              }
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Building Year"
              name="building_year"
              type="number"
              value={formik.values.building_year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.building_year &&
                Boolean(formik.errors.building_year)
              }
              fullWidth
              inputProps={{ min: 1800, max: new Date().getFullYear(), step: 1 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Room Information */}
        <Typography variant="h6">Room Information</Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Number of Rooms"
              name="number_of_rooms"
              type="number"
              value={formik.values.number_of_rooms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.number_of_rooms &&
                Boolean(formik.errors.number_of_rooms)
              }
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Number of Bedrooms"
              name="number_of_bedrooms"
              type="number"
              value={formik.values.number_of_bedrooms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.number_of_bedrooms &&
                Boolean(formik.errors.number_of_bedrooms)
              }
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Number of Bathrooms"
              name="number_of_bathrooms"
              type="number"
              value={formik.values.number_of_bathrooms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.number_of_bathrooms &&
                Boolean(formik.errors.number_of_bathrooms)
              }
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Number of Balconies"
              name="number_of_balconies"
              type="number"
              value={formik.values.number_of_balconies}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.number_of_balconies &&
                Boolean(formik.errors.number_of_balconies)
              }
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Pricing */}
        <Typography variant="h6">Pricing</Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Sale Price (€)"
              name="sell_price"
              type="number"
              value={formik.values.sell_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.sell_price && Boolean(formik.errors.sell_price)
              }
              fullWidth
              inputProps={{ min: 0, step: 1000 }}
              disabled={!formik.values.for_sale}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Rent Price (€/month)"
              name="rent_price"
              type="number"
              value={formik.values.rent_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.rent_price && Boolean(formik.errors.rent_price)
              }
              fullWidth
              inputProps={{ min: 0, step: 100 }}
              disabled={!formik.values.for_rent}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Availability Options */}
        <Typography variant="h6">Availability</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                name="for_sale"
                checked={formik.values.for_sale}
                onChange={(event) => {
                  formik.setFieldValue("for_sale", event.target.checked);
                  if (!event.target.checked) {
                    formik.setFieldValue("sell_price", "");
                  }
                }}
              />
            }
            label="Available for Sale"
          />

          <FormControlLabel
            control={
              <Switch
                name="for_rent"
                checked={formik.values.for_rent}
                onChange={(event) => {
                  formik.setFieldValue("for_rent", event.target.checked);
                  if (!event.target.checked) {
                    formik.setFieldValue("rent_price", "");
                  }
                }}
              />
            }
            label="Available for Rent"
          />

          <FormControlLabel
            control={
              <Switch
                name="published"
                checked={formik.values.published}
                onChange={(event) => {
                  formik.setFieldValue("published", event.target.checked);
                }}
              />
            }
            label="Publish Property"
          />
        </Box>
      </Box>
    </Box>
  );
}

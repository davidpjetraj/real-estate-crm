"use client";

import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  styled,
} from "@mui/material";
import { PropertyModel } from "@/lib/graphql/generated/graphql";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import EuroIcon from "@mui/icons-material/Euro";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import Status from "./Status";
import { getUri } from "@/components/utils/getUri";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: `1px solid ${theme.palette.divider}`,
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  "& .icon": {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    minWidth: "24px",
  },
}));

const ImageGallery = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PropertyImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

interface PropertyDetailsProps {
  property: PropertyModel;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const getStatusInfo = () => {
    if (property.deleted) return { text: "Deleted", color: "error" };
    if (!property.for_sale && !property.for_rent)
      return { text: "Inactive", color: "default" };
    if (property.for_sale && property.for_rent)
      return { text: "Sale & Rent", color: "info" };
    if (property.for_sale) return { text: "For Sale", color: "success" };
    if (property.for_rent) return { text: "For Rent", color: "warning" };
    return { text: "Unknown", color: "default" };
  };

  const status = getStatusInfo();

  const formatPrice = (price: number | null, type: "sale" | "rent") => {
    if (!price) return null;
    const formattedPrice = `€${price.toLocaleString()}`;
    return type === "rent" ? `${formattedPrice}/month` : formattedPrice;
  };

  return (
    <Box>
      {/* Header Section */}
      <StyledCard>
        <CardContent>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {property.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Property ID: #{property.short_id}
              </Typography>
            </Box>
            <Chip
              label={status.text}
              color={status.color as any}
              variant="outlined"
            />
          </Box>

          {property.description && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {property.description}
            </Typography>
          )}
        </CardContent>
      </StyledCard>

      {/* Property Images Gallery */}
      {property.images && property.images.length > 0 ? (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Images ({property.images.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ImageGallery>
              {property.images.map((image, index) => {
                const imageUrl = getUri(image.url);
                console.log(`Image ${index}:`, image);
                console.log(`Image ${index} URL:`, imageUrl);
                return (
                  <PropertyImage
                    key={image.id || index}
                    src={imageUrl}
                    alt={`${property.title} - Image ${index + 1}`}
                    onError={(e) => {
                      console.error(`Failed to load image ${index}:`, imageUrl);
                      (e.target as HTMLImageElement).src = "/image.png";
                    }}
                  />
                );
              })}
            </ImageGallery>
          </CardContent>
        </StyledCard>
      ) : (
        <StyledCard>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              No images available for this property.
            </Typography>
          </CardContent>
        </StyledCard>
      )}

      {/* Basic Information */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <DetailItem>
            <HomeIcon className="icon" />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {property.category.charAt(0).toUpperCase() +
                  property.category.slice(1)}
              </Typography>
            </Box>
          </DetailItem>

          {property.surface && (
            <DetailItem>
              <SquareFootIcon className="icon" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Surface Area
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.surface} m²
                </Typography>
              </Box>
            </DetailItem>
          )}

          {(property.city?.name || property.state?.name) && (
            <DetailItem>
              <LocationOnIcon className="icon" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.city?.name && property.state?.name
                    ? `${property.city.name}, ${property.state.name}`
                    : property.city?.name || property.state?.name}
                </Typography>
              </Box>
            </DetailItem>
          )}

          <DetailItem>
            <CalendarTodayIcon className="icon" />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Created
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(property.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </DetailItem>

          <DetailItem>
            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Status data={property} />
            </Box>
          </DetailItem>
        </CardContent>
      </StyledCard>

      {/* Pricing Information */}
      {(property.sell_price || property.rent_price) && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pricing
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {property.for_sale && property.sell_price && (
              <DetailItem>
                <EuroIcon className="icon" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Sale Price
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(property.sell_price, "sale")}
                  </Typography>
                </Box>
              </DetailItem>
            )}

            {property.for_rent && property.rent_price && (
              <DetailItem>
                <EuroIcon className="icon" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Rent Price
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(property.rent_price, "rent")}
                  </Typography>
                </Box>
              </DetailItem>
            )}
          </CardContent>
        </StyledCard>
      )}

      {/* Additional Details */}
      {(property.number_of_bedrooms ||
        property.number_of_bathrooms ||
        property.number_of_balconies) && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Property Features
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box display="flex" flexWrap="wrap" gap={2}>
              {property.number_of_bedrooms && (
                <Box flex="1" minWidth="120px" textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {property.number_of_bedrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bedrooms
                  </Typography>
                </Box>
              )}

              {property.number_of_bathrooms && (
                <Box flex="1" minWidth="120px" textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {property.number_of_bathrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bathrooms
                  </Typography>
                </Box>
              )}

              {property.number_of_balconies && (
                <Box flex="1" minWidth="120px" textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {property.number_of_balconies}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Balconies
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      )}

      {/* Agent Information */}
      {property.agent && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Agent Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <DetailItem>
              <BusinessIcon className="icon" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Agent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.agent.name}
                </Typography>
              </Box>
            </DetailItem>
          </CardContent>
        </StyledCard>
      )}
    </Box>
  );
}

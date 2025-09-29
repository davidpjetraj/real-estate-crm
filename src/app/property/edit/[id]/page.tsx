"use client";

import { useState } from "react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { styled } from "@mui/material";

import {
  PropertyCategory,
  StatesDocument,
  CitiesDocument,
  StreetsDocument,
  UpdatePropertyDocument,
  PropertyDetailsDocument,
} from "@/lib/graphql/generated/graphql";
import Step1BasicInfo from "../../create/steps/Step1BasicInfo";
import Step2Details from "../../create/steps/Step2Details";
import useAuth from "../../../../../store/useAuth";
import Header from "../../create/components/Header";
import Sidebar from "../../create/components/Sidebar";
import Footer from "../../create/components/Footer";
import SkeletonLoader from "@/components/Form/Loader/SkeletonLoader";

const Wrapper = styled("div")`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const Main = styled("div")`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Content = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FormContent = styled("div")`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// Validation schemas for each step
const step1Schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string()
    .oneOf(Object.values(PropertyCategory))
    .required("Category is required"),
  state_id: Yup.string().required("State is required"),
  city_id: Yup.string().required("City is required"),
  street_id: Yup.string().optional(),
});

const step2Schema = Yup.object({
  surface: Yup.number().positive("Surface must be positive").optional(),
  number_of_floors: Yup.number()
    .integer("Number of floors must be an integer")
    .positive("Number of floors must be positive")
    .optional(),
  building_year: Yup.number()
    .integer("Building year must be an integer")
    .min(1800, "Building year must be after 1800")
    .max(new Date().getFullYear(), "Building year cannot be in the future")
    .optional(),
  number_of_rooms: Yup.number()
    .integer("Number of rooms must be an integer")
    .positive("Number of rooms must be positive")
    .optional(),
  number_of_bathrooms: Yup.number()
    .integer("Number of bathrooms must be an integer")
    .positive("Number of bathrooms must be positive")
    .optional(),
  number_of_bedrooms: Yup.number()
    .integer("Number of bedrooms must be an integer")
    .positive("Number of bedrooms must be positive")
    .optional(),
  number_of_balconies: Yup.number()
    .integer("Number of balconies must be an integer")
    .min(0, "Number of balconies cannot be negative")
    .optional(),
  sell_price: Yup.number().positive("Sell price must be positive").optional(),
  rent_price: Yup.number().positive("Rent price must be positive").optional(),
});

const validationSchemas = [step1Schema, step2Schema];

interface FormValues {
  // Step 1: Basic Information
  title: string;
  description: string;
  category: PropertyCategory | "";
  state_id: string;
  city_id: string;
  street_id: string;

  // Step 2: Property Details
  surface: number | "";
  number_of_floors: number | "";
  building_year: number | "";
  number_of_rooms: number | "";
  number_of_bathrooms: number | "";
  number_of_bedrooms: number | "";
  number_of_balconies: number | "";
  sell_price: number | "";
  rent_price: number | "";
  for_sale: boolean;
  for_rent: boolean;
  published: boolean;
}

// Default initial values
const defaultInitialValues: FormValues = {
  // Step 1
  title: "",
  description: "",
  category: "",
  state_id: "",
  city_id: "",
  street_id: "",

  // Step 2
  surface: "",
  number_of_floors: "",
  building_year: "",
  number_of_rooms: "",
  number_of_bathrooms: "",
  number_of_bedrooms: "",
  number_of_balconies: "",
  sell_price: "",
  rent_price: "",
  for_sale: false,
  for_rent: false,
  published: false,
};

const steps = [
  {
    title: "Basic Information",
    description: "Enter property title, description and location",
    component: Step1BasicInfo,
  },
  {
    title: "Property Details",
    description: "Add detailed specifications and pricing",
    component: Step2Details,
  },
];

export default function EditPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] =
    useState<FormValues>(defaultInitialValues);
  const router = useRouter();
  const { user } = useAuth((state) => state);

  const { id } = useParams();

  const [updateProperty] = useMutation(UpdatePropertyDocument);

  // Fetch existing property data
  const { loading: propertyLoading } = useQuery(PropertyDetailsDocument, {
    variables: { input: { id: id as string } },
    skip: !id,
    onCompleted: (data) => {
      if (data?.propertyDetails) {
        const property = data.propertyDetails;
        setInitialValues({
          // Step 1
          title: property.title || "",
          description: property.description || "",
          category: property.category || "",
          state_id: property.state?.id || "",
          city_id: property.city?.id || "",
          street_id: property.street?.id || "",

          // Step 2
          surface: property.surface || "",
          number_of_floors: property.number_of_floors || "",
          building_year: property.building_year || "",
          number_of_rooms: property.number_of_rooms || "",
          number_of_bathrooms: property.number_of_bathrooms || "",
          number_of_bedrooms: property.number_of_bedrooms || "",
          number_of_balconies: property.number_of_balconies || "",
          sell_price: property.sell_price || "",
          rent_price: property.rent_price || "",
          for_sale: property.for_sale || false,
          for_rent: property.for_rent || false,
          published: property.published || false,
        });
      }
    },
  });

  // Fetch location data
  const { data: statesData } = useQuery(StatesDocument, {
    variables: { input: {} },
  });

  const { data: citiesData } = useQuery(CitiesDocument, {
    variables: { input: {} },
  });

  const { data: streetsData } = useQuery(StreetsDocument, {
    variables: { input: {} },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    router.push("/property");
  };

  const handleSubmit = async (values: FormValues) => {
    if (currentStep < steps.length - 1) {
      handleNext();
      return;
    }

    // Final submission
    try {
      // Check if user is authenticated and has an ID
      if (!user?.id) {
        console.error("User not authenticated or missing ID");
        router.push("/login");
        return;
      }

      setIsSubmitting(true);

      const input = {
        id: id as string, // Property ID for update
        title: values.title,
        description: values.description,
        category: values.category as PropertyCategory,
        state_id: values.state_id || undefined,
        city_id: values.city_id || undefined,
        street_id: values.street_id || undefined,
        surface: values.surface ? Number(values.surface) : undefined,
        number_of_floors: values.number_of_floors
          ? Number(values.number_of_floors)
          : undefined,
        building_year: values.building_year
          ? Number(values.building_year)
          : undefined,
        number_of_rooms: values.number_of_rooms
          ? Number(values.number_of_rooms)
          : undefined,
        number_of_bathrooms: values.number_of_bathrooms
          ? Number(values.number_of_bathrooms)
          : undefined,
        number_of_bedrooms: values.number_of_bedrooms
          ? Number(values.number_of_bedrooms)
          : undefined,
        number_of_balconies: values.number_of_balconies
          ? Number(values.number_of_balconies)
          : undefined,
        sell_price: values.sell_price ? Number(values.sell_price) : undefined,
        rent_price: values.rent_price ? Number(values.rent_price) : undefined,
        for_sale: values.for_sale,
        for_rent: values.for_rent,
        published: values.published,
        agent_id: user.id, // Get from authenticated user
      };

      const { data } = await updateProperty({
        variables: { input },
      });

      if (data?.updateProperty) {
        router.push("/property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      // TODO: Show user-friendly error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Show loading state while fetching property data
  if (propertyLoading) {
    return (
      <Wrapper>
        <Header title="Edit Property" backHref="/property" />
        <SkeletonLoader />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header title="Edit Property" backHref="/property" />

      <Main>
        <Sidebar
          step={currentStep}
          options={steps.map(({ title, description }) => ({
            title,
            description,
          }))}
        />

        <Content>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[currentStep]}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(formik: FormikProps<FormValues>) => (
              <>
                <FormContent>
                  <CurrentStepComponent
                    formik={formik}
                    statesData={statesData}
                    citiesData={citiesData}
                    streetsData={streetsData}
                  />
                </FormContent>

                <Footer
                  formik={formik}
                  onBack={handleBack}
                  onContinue={() => formik.handleSubmit()}
                  onCancel={handleCancel}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === steps.length - 1}
                  currentStep={currentStep}
                  createLabel="Update Property"
                  editPage={true}
                  isSubmitting={isSubmitting}
                />
              </>
            )}
          </Formik>
        </Content>
      </Main>
    </Wrapper>
  );
}

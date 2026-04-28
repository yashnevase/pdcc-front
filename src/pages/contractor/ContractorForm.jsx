import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import DropdownSearch from "../../components/common/DropdownSearch";
import { Users } from "lucide-react";
import FormLayout from "../../components/common/FormLayout";
import SubeForm from "./SubeForm";
import MajurForm from "./MajurForm";
import { roleService } from "../../services";

// Schema for contractor form
const contractorSchema = z.object({
  contractor_type: z.enum(["majur", "sube"], {
    required_error: "Please select a contractor type",
  }),

  // Common fields
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  role_id: z.string().optional(),

  // Sube fields
  sube_title: z.string().optional(),
  sube_first_name: z.string().optional(),
  sube_father_husband_name: z.string().optional(),
  sube_last_name: z.string().optional(),
  sube_whatsapp_number: z.string().optional(),
  sube_username: z.string().optional(),
  sube_birth_place: z.string().optional(),
  sube_birth_date: z.string().optional(),
  sube_taluka: z.string().optional(),
  sube_aadhar_number: z.string().optional(),
  sube_pan_number: z.string().optional(),
  sube_gst_number: z.string().optional(),
  sube_current_address: z.string().optional(),
  sube_technical_qualification: z.string().optional(),
  sube_trade: z.string().optional(),
  sube_institution_name: z.string().optional(),
  sube_university_name: z.string().optional(),
  sube_passing_year: z.string().optional(),
  sube_business_location: z.string().optional(),
  sube_bank_name: z.string().optional(),
  sube_bank_address: z.string().optional(),

  // Majur fields
  majur_society_name: z.string().optional(),
  majur_society_address: z.string().optional(),
  majur_registration_district: z.string().optional(),
  majur_sub_registrar: z.string().optional(),
  majur_registration_number: z.string().optional(),
  majur_registration_date: z.string().optional(),
  majur_taluka: z.string().optional(),
  majur_financial_stability: z.string().optional(),
  majur_share_capital: z.string().optional(),
  majur_government_share: z.string().optional(),
  majur_registration_class: z.string().optional(),
  majur_inspection_class: z.string().optional(),
  majur_other_department_classification: z.string().optional(),
  majur_member_in_other_society: z.string().optional(),
  majur_chairman_name: z.string().optional(),
  majur_chairman_whatsapp: z.string().optional(),
  majur_chairman_aadhar: z.string().optional(),
  majur_society_pan: z.string().optional(),
  majur_society_gst: z.string().optional(),
  majur_chairman_address: z.string().optional(),
});

const ContractorForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isEditMode = false,
  isViewMode = false,
}) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(
    initialData?.contractor_type || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      contractor_type: initialData?.contractor_type || "",
      email: initialData?.email || "",
      role_id: initialData?.role_id ? initialData.role_id.toString() : "",
      ...initialData,
    },
  });

  // Fetch roles for dropdown
  useEffect(() => {
    const loadRoles = async () => {
      const data = await roleService.getRoles();
      // Handle paginated response with data array
      const rolesList = data.data || [];
      setRoles(rolesList);
    };
    loadRoles();
  }, []);

  // Watch for type changes
  const watchedType = watch("contractor_type");
  useEffect(() => {
    if (watchedType && watchedType !== selectedType) {
      setSelectedType(watchedType);
      handleTypeChange(watchedType);
    }
  }, [watchedType, selectedType]);

  const handleTypeChange = (type) => {
    setValue("contractor_type", type);
    setSelectedType(type);
    // Clear only the other type's field when switching, keep common fields like email
    if (type === "majur") {
      // Clear all sube fields
      Object.keys(control._formValues).forEach((key) => {
        if (key.startsWith("sube_")) {
          setValue(key, "");
        }
      });
    } else if (type === "sube") {
      // Clear all majur fields
      Object.keys(control._formValues).forEach((key) => {
        if (key.startsWith("majur_")) {
          setValue(key, "");
        }
      });
    }
  };

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Prepare submission data based on type
      const submitData = {
        contractor_type: data.contractor_type,
        email: data.email || null,
        role_id: data.role_id ? parseInt(data.role_id) : null,
        status: "active", // Default to active
      };

      // Add type-specific fields
      if (data.contractor_type === "sube") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("sube_") && data[key]) {
            submitData[key] = data[key];
          }
        });
      } else if (data.contractor_type === "majur") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("majur_") && data[key]) {
            submitData[key] = data[key];
          }
        });
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout
      title="Contractor"
      subtitle={
        isEditMode ? "Edit contractor information" : "Create new contractor"
      }
      icon={Users}
      onSubmit={handleSubmit(onFormSubmit)}
      onCancel={() => navigate("/contractor")}
      isEditMode={isEditMode}
      isViewMode={isViewMode}
      loading={isLoading}
    >
      {/* Contractor Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Contractor Type *
        </label>
        <div className="w-64">
          <Controller
            name="contractor_type"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropdownSearch
                value={value}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  onChange(selectedValue);
                  handleTypeChange(selectedValue);
                }}
                disabled={isViewMode}
                placeholder="Select contractor type"
                options={[
                  { id: "majur", name: "Majur" },
                  { id: "sube", name: "Sube" },
                ]}
              />
            )}
          />
        </div>
        {errors.contractor_type && (
          <p className="mt-1 text-sm text-red-500">
            {errors.contractor_type.message}
          </p>
        )}
      </div>

      {/* Common Fields */}
      <div className="bg-yellow-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Email (Username)"
            placeholder="Enter email address"
            {...control.register("email")}
            error={errors.email?.message}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Dynamic Fields Based on Type */}
      {selectedType && (
        <div className="mt-6">
          {selectedType === "sube" && (
            <SubeForm
              control={control}
              errors={errors}
              isViewMode={isViewMode}
            />
          )}
          {selectedType === "majur" && (
            <MajurForm
              control={control}
              errors={errors}
              isViewMode={isViewMode}
            />
          )}
        </div>
      )}
    </FormLayout>
  );
};

export default ContractorForm;

import React, { useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { PatientInfo } from "../types";

const PatientInfoForm: React.FC = () => {
  const { updatePatientInfo } = useAppContext();

  // const [formData, setFormData] = useState<PatientInfo>({
  //   id: "",
  //   name: "",
  //   age: 0,
  //   gender: "",
  //   medicalHistory: "",
  // });

  // const [isSaved, setIsSaved] = useState(false);

  // Fetch patient info on mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;

        const patient: PatientInfo = {
          id: String(user.id),
          name: user.username || "",
          age: user.age || 0,
          gender: (user.gender || "").toLowerCase(),
          medicalHistory: user.medicalHistory || "",
        };

        // setFormData(patient);
        updatePatientInfo(patient); // optional
      } catch (error) {
        console.error("❌ Failed to fetch user data:", error);
      }
    };

    fetchPatient();
  }, []); // <--- empty dependency array means run only once

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: name === "age" ? parseInt(value) || 0 : value,
  //   }));
  //   setIsSaved(false);
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   updatePatientInfo(formData);
  //   setIsSaved(true);

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       console.error("No auth token found.");
  //       return;
  //     }

  //     // Send patient info + prediction to your Flask API
  //     const response = await axios.post(
  //       "http://localhost:5000/results",
  //       {
  //         disease_status: "PAKINSON", // or "NORMAL" - based on logic
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("Saved result:", response.data);
  //   } catch (err) {
  //     console.error("Failed to save result:", err);
  //   }

  //   setTimeout(() => setIsSaved(false), 3000);
  // };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Patient Information
        </h2> */}

        {/* <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter patient name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter age"
                  min="0"
                  max="120"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="medicalHistory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Relevant Medical History
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter any relevant medical history or notes"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Save Information
              </button>
            </div>

            {isSaved && (
              <div className="text-green-600 text-sm mt-2 text-right">
                Patient information saved successfully!
              </div>
            )}
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default PatientInfoForm;

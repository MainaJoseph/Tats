// components/EditClientModal.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import ReactCountryFlag from "react-country-flag";
import { getCountryCode, countries } from "@/lib/countrySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateClientDetailsSchema } from "@/schemas";
import { FormErrorSecond } from "@/app/components/form-error-2";

interface Client {
  id: number;
  name: string;
  allowedscope: string | null;
  country: string;
  dateCreated: string;
}

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onUpdate: (updatedClient: Client) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  client,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(client.name);
  const [country, setCountry] = useState(client.country);
  const [allowedScope, setAllowedScope] = useState(client.allowedscope || "");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form data
    const formData = {
      name,
      country,
      allowedscope: allowedScope,
    };

    // Clear previous validation errors
    setValidationErrors([]);

    // Validate form data
    const validation = UpdateClientDetailsSchema.safeParse(formData);

    if (!validation.success) {
      // Collect validation error messages
      const errors = validation.error.errors.map((err) => err.message);
      setValidationErrors(errors); // Set the validation errors state
      return;
    }

    // Proceed with API request
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${apiBaseUrl}/clients/${client.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update client");
      }

      const updatedClient = await response.json();
      onUpdate(updatedClient);
      toast({
        title: "Client Updated",
        description: "The client has been successfully updated.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      onClose();
    } catch (error) {
      console.error("Failed to update client", error);
      setValidationErrors(["Failed to update client."]); // Show an error message if the API request fails
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      style={{ borderRadius: "6px" }}
    >
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Edit Client</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="flex flex-row items-center text-sm font-medium text-gray-700"
          >
            Client Name <span className="text-rose-500 ">*</span>
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter client name"
            className="mt-1"
            style={{ borderRadius: "6px" }}
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="flex flex-row text-sm font-medium text-gray-700"
          >
            Country<span className="text-rose-500 ">*</span>
          </label>
          <div className="mt-1 flex items-center">
            <ReactCountryFlag
              countryCode={getCountryCode(country)} //
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
                marginRight: "0.5em",
              }}
            />
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent
                className="bg-slate-800 text-white top-4 h-1/2"
                style={{ marginTop: "20px", borderRadius: "6px" }}
              >
                <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                <SelectItem value="Albania">Albania</SelectItem>
                <SelectItem value="Algeria">Algeria</SelectItem>
                <SelectItem value="Andorra">Andorra</SelectItem>
                <SelectItem value="Angola">Angola</SelectItem>
                <SelectItem value="Antigua and Barbuda">
                  Antigua and Barbuda
                </SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Armenia">Armenia</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Austria">Austria</SelectItem>
                <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                <SelectItem value="Bahamas">Bahamas</SelectItem>
                <SelectItem value="Bahrain">Bahrain</SelectItem>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="Barbados">Barbados</SelectItem>
                <SelectItem value="Belarus">Belarus</SelectItem>
                <SelectItem value="Belgium">Belgium</SelectItem>
                <SelectItem value="Belize">Belize</SelectItem>
                <SelectItem value="Benin">Benin</SelectItem>
                <SelectItem value="Bhutan">Bhutan</SelectItem>
                <SelectItem value="Bolivia">Bolivia</SelectItem>
                <SelectItem value="Bosnia and Herzegovina">
                  Bosnia and Herzegovina
                </SelectItem>
                <SelectItem value="Botswana">Botswana</SelectItem>
                <SelectItem value="Brazil">Brazil</SelectItem>
                <SelectItem value="Brunei">Brunei</SelectItem>
                <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                <SelectItem value="Burundi">Burundi</SelectItem>
                <SelectItem value="Cabo Verde">Cabo Verde</SelectItem>
                <SelectItem value="Cambodia">Cambodia</SelectItem>
                <SelectItem value="Cameroon">Cameroon</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Central African Republic">
                  Central African Republic
                </SelectItem>
                <SelectItem value="Chad">Chad</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="China">China</SelectItem>
                <SelectItem value="Colombia">Colombia</SelectItem>
                <SelectItem value="Comoros">Comoros</SelectItem>
                <SelectItem value="Congo (Congo-Brazzaville)">
                  Congo (Congo-Brazzaville)
                </SelectItem>
                <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                <SelectItem value="Croatia">Croatia</SelectItem>
                <SelectItem value="Cuba">Cuba</SelectItem>
                <SelectItem value="Cyprus">Cyprus</SelectItem>
                <SelectItem value="Czechia">Czechia</SelectItem>
                <SelectItem value="Democratic Republic of the Congo">
                  Democratic Republic of the Congo
                </SelectItem>
                <SelectItem value="Denmark">Denmark</SelectItem>
                <SelectItem value="Djibouti">Djibouti</SelectItem>
                <SelectItem value="Dominica">Dominica</SelectItem>
                <SelectItem value="Dominican Republic">
                  Dominican Republic
                </SelectItem>
                <SelectItem value="Ecuador">Ecuador</SelectItem>
                <SelectItem value="Egypt">Egypt</SelectItem>
                <SelectItem value="El Salvador">El Salvador</SelectItem>
                <SelectItem value="Equatorial Guinea">
                  Equatorial Guinea
                </SelectItem>
                <SelectItem value="Eritrea">Eritrea</SelectItem>
                <SelectItem value="Estonia">Estonia</SelectItem>
                <SelectItem value="Eswatini">Eswatini</SelectItem>
                <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                <SelectItem value="Fiji">Fiji</SelectItem>
                <SelectItem value="Finland">Finland</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Gabon">Gabon</SelectItem>
                <SelectItem value="Gambia">Gambia</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Ghana">Ghana</SelectItem>
                <SelectItem value="Greece">Greece</SelectItem>
                <SelectItem value="Grenada">Grenada</SelectItem>
                <SelectItem value="Guatemala">Guatemala</SelectItem>
                <SelectItem value="Guinea">Guinea</SelectItem>
                <SelectItem value="Guinea-Bissau">Guinea-Bissau</SelectItem>
                <SelectItem value="Guyana">Guyana</SelectItem>
                <SelectItem value="Haiti">Haiti</SelectItem>
                <SelectItem value="Honduras">Honduras</SelectItem>
                <SelectItem value="Hungary">Hungary</SelectItem>
                <SelectItem value="Iceland">Iceland</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Iran">Iran</SelectItem>
                <SelectItem value="Iraq">Iraq</SelectItem>
                <SelectItem value="Ireland">Ireland</SelectItem>
                <SelectItem value="Israel">Israel</SelectItem>
                <SelectItem value="Italy">Italy</SelectItem>
                <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
                <SelectItem value="Jamaica">Jamaica</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="Jordan">Jordan</SelectItem>
                <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Kiribati">Kiribati</SelectItem>
                <SelectItem value="Kuwait">Kuwait</SelectItem>
                <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                <SelectItem value="Laos">Laos</SelectItem>
                <SelectItem value="Latvia">Latvia</SelectItem>
                <SelectItem value="Lebanon">Lebanon</SelectItem>
                <SelectItem value="Lesotho">Lesotho</SelectItem>
                <SelectItem value="Liberia">Liberia</SelectItem>
                <SelectItem value="Libya">Libya</SelectItem>
                <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
                <SelectItem value="Lithuania">Lithuania</SelectItem>
                <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                <SelectItem value="Madagascar">Madagascar</SelectItem>
                <SelectItem value="Malawi">Malawi</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Maldives">Maldives</SelectItem>
                <SelectItem value="Mali">Mali</SelectItem>
                <SelectItem value="Malta">Malta</SelectItem>
                <SelectItem value="Marshall Islands">
                  Marshall Islands
                </SelectItem>
                <SelectItem value="Mauritania">Mauritania</SelectItem>
                <SelectItem value="Mauritius">Mauritius</SelectItem>
                <SelectItem value="Mexico">Mexico</SelectItem>
                <SelectItem value="Micronesia">Micronesia</SelectItem>
                <SelectItem value="Moldova">Moldova</SelectItem>
                <SelectItem value="Monaco">Monaco</SelectItem>
                <SelectItem value="Mongolia">Mongolia</SelectItem>
                <SelectItem value="Montenegro">Montenegro</SelectItem>
                <SelectItem value="Morocco">Morocco</SelectItem>
                <SelectItem value="Mozambique">Mozambique</SelectItem>
                <SelectItem value="Myanmar (Burma)">Myanmar (Burma)</SelectItem>
                <SelectItem value="Namibia">Namibia</SelectItem>
                <SelectItem value="Nauru">Nauru</SelectItem>
                <SelectItem value="Nepal">Nepal</SelectItem>
                <SelectItem value="Netherlands">Netherlands</SelectItem>
                <SelectItem value="New Zealand">New Zealand</SelectItem>
                <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                <SelectItem value="Niger">Niger</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="North Korea">North Korea</SelectItem>
                <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                <SelectItem value="Norway">Norway</SelectItem>
                <SelectItem value="Oman">Oman</SelectItem>
                <SelectItem value="Pakistan">Pakistan</SelectItem>
                <SelectItem value="Palau">Palau</SelectItem>
                <SelectItem value="Panama">Panama</SelectItem>
                <SelectItem value="Papua New Guinea">
                  Papua New Guinea
                </SelectItem>
                <SelectItem value="Paraguay">Paraguay</SelectItem>
                <SelectItem value="Peru">Peru</SelectItem>
                <SelectItem value="Philippines">Philippines</SelectItem>
                <SelectItem value="Poland">Poland</SelectItem>
                <SelectItem value="Portugal">Portugal</SelectItem>
                <SelectItem value="Qatar">Qatar</SelectItem>
                <SelectItem value="Romania">Romania</SelectItem>
                <SelectItem value="Russia">Russia</SelectItem>
                <SelectItem value="Rwanda">Rwanda</SelectItem>
                <SelectItem value="Saint Kitts and Nevis">
                  Saint Kitts and Nevis
                </SelectItem>
                <SelectItem value="Saint Lucia">Saint Lucia</SelectItem>
                <SelectItem value="Saint Vincent and the Grenadines">
                  Saint Vincent and the Grenadines
                </SelectItem>
                <SelectItem value="Samoa">Samoa</SelectItem>
                <SelectItem value="San Marino">San Marino</SelectItem>
                <SelectItem value="Sao Tome and Principe">
                  Sao Tome and Principe
                </SelectItem>
                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                <SelectItem value="Senegal">Senegal</SelectItem>
                <SelectItem value="Serbia">Serbia</SelectItem>
                <SelectItem value="Seychelles">Seychelles</SelectItem>
                <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Slovakia">Slovakia</SelectItem>
                <SelectItem value="Slovenia">Slovenia</SelectItem>
                <SelectItem value="Solomon Islands">Solomon Islands</SelectItem>
                <SelectItem value="Somalia">Somalia</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
                <SelectItem value="South Sudan">South Sudan</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                <SelectItem value="Sudan">Sudan</SelectItem>
                <SelectItem value="Suriname">Suriname</SelectItem>
                <SelectItem value="Sweden">Sweden</SelectItem>
                <SelectItem value="Switzerland">Switzerland</SelectItem>
                <SelectItem value="Syria">Syria</SelectItem>
                <SelectItem value="Taiwan">Taiwan</SelectItem>
                <SelectItem value="Tajikistan">Tajikistan</SelectItem>
                <SelectItem value="Tanzania">Tanzania</SelectItem>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="Timor-Leste">Timor-Leste</SelectItem>
                <SelectItem value="Togo">Togo</SelectItem>
                <SelectItem value="Tonga">Tonga</SelectItem>
                <SelectItem value="Trinidad and Tobago">
                  Trinidad and Tobago
                </SelectItem>
                <SelectItem value="Tunisia">Tunisia</SelectItem>
                <SelectItem value="Turkey">Turkey</SelectItem>
                <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
                <SelectItem value="Tuvalu">Tuvalu</SelectItem>
                <SelectItem value="Uganda">Uganda</SelectItem>
                <SelectItem value="Ukraine">Ukraine</SelectItem>
                <SelectItem value="United Arab Emirates">
                  United Arab Emirates
                </SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Uruguay">Uruguay</SelectItem>
                <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                <SelectItem value="Vanuatu">Vanuatu</SelectItem>
                <SelectItem value="Vatican City">Vatican City</SelectItem>
                <SelectItem value="Venezuela">Venezuela</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Yemen">Yemen</SelectItem>
                <SelectItem value="Zambia">Zambia</SelectItem>
                <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label
            htmlFor="allowedScope"
            className="block text-sm font-medium text-gray-700"
          >
            Allowed Scope
          </label>
          <Input
            id="allowedScope"
            value={allowedScope}
            onChange={(e) => setAllowedScope(e.target.value)}
            placeholder="Enter allowed scope"
            className="mt-1"
            style={{ borderRadius: "6px" }}
          />
        </div>
        {/* Display validation errors using FormErrorSecond */}
        {validationErrors.map((error, index) => (
          <FormErrorSecond key={index} message={error} />
        ))}
      </div>
      <DialogFooter className="space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border hover:border-red-500"
          style={{ borderRadius: "6px" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-500 text-white hover:bg-blue-600"
          style={{ borderRadius: "6px" }}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditClientModal;

import axios from 'axios';

const userId = 404; // User ID to whom the vehicles will be added
const apiUrl = `http://localhost:2222/vehicles/addvehicletouser/${userId}`;
const numberOfVehicles = 40;

const vehicleTemplate = {
  plateNumber: "ABCd",
  chassisNumber: "XYZ987654321",
  vehicleType: "Toyota",
  vehicleModel: "Corolla",
  yearOfManufacture: 2020,
  usage: "Private"
};

const addVehicles = async () => {
  for (let i = 1; i <= numberOfVehicles; i++) {
    const vehicleData = {
      ...vehicleTemplate,
      plateNumber: `ABC-${i}`, // Unique plate number
      chassisNumber: `XYZ-${i}` // Unique chassis number
    };

    try {
      const response = await axios.post(apiUrl, vehicleData);
      console.log(`✅ Vehicle ${i} added:`, response.data);
    } catch (error) {
      console.error(`❌ Failed to add vehicle ${i}:`, error.response?.data || error.message);
    }
  }
};

addVehicles();

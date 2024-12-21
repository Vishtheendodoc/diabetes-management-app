import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DiabetesCalculator = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    sex: '',
  });

  const [medicalData, setMedicalData] = useState({
    totalDailyDose: '',
    currentBG: '',
    targetBG: '',
    usualDose: '',
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

const handlePersonalInfoChange = (e) => {
  const { name, value } = e.target;
  setPersonalInfo((prev) => {
    const newState = { ...prev };
    newState[name] = value;
    return newState;
  });
};

const handleMedicalDataChange = (e) => {
  const { name, value } = e.target;
  setMedicalData((prev) => {
    const newState = { ...prev };
    newState[name] = value;
    return newState;
  });
};
  };

  const calculateDose = () => {
    setError('');
    
    // Validate personal info
    if (Object.values(personalInfo).some(value => value === '')) {
      setError('Please fill in all personal information');
      return;
    }

    // Validate medical data
    if (Object.values(medicalData).some(value => value === '')) {
      setError('Please fill in all medical data');
      return;
    }

    const tdd = parseFloat(medicalData.totalDailyDose);
    const currentBG = parseFloat(medicalData.currentBG);
    const targetBG = parseFloat(medicalData.targetBG);
    const usualDose = parseFloat(medicalData.usualDose);

    // Validate values
    if (tdd <= 0 || currentBG < 0 || targetBG < 0 || usualDose < 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    try {
      // Calculate ISF (1500 rule)
      const isf = 1500 / tdd;
      
      // Calculate correction dose
      const bgDiff = currentBG - targetBG;
      const correctionDose = bgDiff / isf;
      
      // Calculate total insulin dose
      const totalDose = usualDose + correctionDose;

      setResults({
        isf: Math.round(isf * 10) / 10,
        correctionDose: Math.round(correctionDose * 10) / 10,
        totalDose: Math.round(totalDose * 10) / 10
      });
    } catch (err) {
      setError('Error in calculations. Please check your inputs.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Comprehensive Diabetes Management Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={personalInfo.age}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your age"
                  min="0"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sex</label>
                <select
                  name="sex"
                  value={personalInfo.sex}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Data Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Medical Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Daily Dose of Insulin (units)
                </label>
                <input
                  type="number"
                  name="totalDailyDose"
                  value={medicalData.totalDailyDose}
                  onChange={handleMedicalDataChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your total daily insulin dose"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Blood Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  name="currentBG"
                  value={medicalData.currentBG}
                  onChange={handleMedicalDataChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter current blood glucose"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Blood Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  name="targetBG"
                  value={medicalData.targetBG}
                  onChange={handleMedicalDataChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter target blood glucose"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Usual Insulin Dose (units)
                </label>
                <input
                  type="number"
                  name="usualDose"
                  value={medicalData.usualDose}
                  onChange={handleMedicalDataChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your usual insulin dose"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={calculateDose}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Calculate Insulin Dose
          </button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && !error && (
            <div className="mt-4 p-4 bg-green-50 rounded space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium text-green-800">Patient Information</h3>
                <p>Name: {personalInfo.name}</p>
                <p>Age: {personalInfo.age}</p>
                <p>Sex: {personalInfo.sex}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-green-800">Insulin Sensitivity Factor (ISF)</h3>
                <p className="text-xl font-bold text-green-600">
                  {results.isf} mg/dL per unit
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-green-800">Correction Dose</h3>
                <p className="text-xl font-bold text-green-600">
                  {results.correctionDose} units
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-green-800">Total Recommended Dose</h3>
                <p className="text-2xl font-bold text-green-600">
                  {results.totalDose} units
                </p>
                <p className="text-sm text-green-700">
                  (Usual dose + correction dose)
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default DiabetesCalculator;

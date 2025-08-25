"use client"

import { getPatients, getPendingConsultations, setScheduleConsultation } from "@/components/api/patient";
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Pill, Calendar, User, Plus, Edit, Trash2, Info, RefreshCw } from "lucide-react"

// Mock data
const mockMedications = [
  { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "1x daily", category: "ACE Inhibitor", stock: 150 },
  { id: 2, name: "Metoprolol", dosage: "50mg", frequency: "2x daily", category: "Beta Blocker", stock: 200 },
  { id: 3, name: "Atorvastatin", dosage: "20mg", frequency: "1x daily", category: "Statin", stock: 180 },
  { id: 4, name: "Aspirin", dosage: "81mg", frequency: "1x daily", category: "Antiplatelet", stock: 300 },
]

const mockPatients = [
  {
    id: 1,
    name: "Ahmad Wijaya",
    age: 58,
    condition: "Hypertension",
    classification: 0,
    cholesterolLevel: "Normal",
    severity: "moderate",
    isHavingHypertension: 1,
    isSmoker: 1,
    lastVisit: "2024-01-15",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "1x daily", notes: "Take with food, monitor blood pressure" },
      { name: "Metoprolol", dosage: "25mg", frequency: "2x daily", notes: "Take morning and evening" },
    ],
    status: "stable",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    age: 45,
    condition: "Coronary Artery Disease",
    severity: "severe",
    lastVisit: "2024-01-10",
    medications: [
      { name: "Atorvastatin", dosage: "40mg", frequency: "1x daily", notes: "Take at bedtime, avoid grapefruit" },
      { name: "Aspirin", dosage: "81mg", frequency: "1x daily", notes: "Low dose for cardioprotection" },
    ],
    status: "needs_consultation",
  },
  {
    id: 3,
    name: "Budi Santoso",
    age: 62,
    condition: "Heart Failure",
    severity: "severe",
    lastVisit: "2024-01-12",
    medications: [
      { name: "Lisinopril", dosage: "20mg", frequency: "1x daily", notes: "Monitor kidney function" },
      { name: "Metoprolol", dosage: "50mg", frequency: "2x daily", notes: "Start low dose, titrate up slowly" },
    ],
    status: "critical",
  },
]

export default function DoctorDashboard() {
  const [medications, setMedications] = useState(mockMedications)
  // const [patients, setPatients] = useState(mockPatients)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [consultationNotes, setConsultationNotes] = useState("")
  const [consultationAction, setConsultationAction] = useState("")
  const [editingMedication, setEditingMedication] = useState(null)
  const [selectedMedicationForAssignment, setSelectedMedicationForAssignment] = useState("")
  const [assignmentDosage, setAssignmentDosage] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    category: "",
    stock: 0,
  })

  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    console.log("here")
    getPatients().then(setPatients).catch(console.error);
    getPendingConsultations().then(setConsultations).catch(console.error);
    console.log(consultations)
    console.log(consultations)
    // return () => clearInterval(interval); // bersihkan interval saat komponen unmount
  }, []);

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 0:
        return "bg-green-100 text-green-800"
      case 1:
        return "bg-red-100 text-red-800"
    }
  }

  const getAdditionalInfoColor = (info) => {
    switch (info) {
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCholesterolColor = (status) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800"
      case "Low":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([
        ...medications,
        {
          ...newMedication,
          id: medications.length + 1,
          stock: Number.parseInt(newMedication.stock),
        },
      ])
      setNewMedication({ name: "", dosage: "", frequency: "", category: "", stock: 0 })
    }
  }

  const updateMedication = () => {
    if (editingMedication && editingMedication.name && editingMedication.dosage) {
      setMedications(
        medications.map((med) =>
          med.id === editingMedication.id
            ? { ...editingMedication, stock: Number.parseInt(editingMedication.stock) }
            : med,
        ),
      )
      setEditingMedication(null)
    }
  }

  const deleteMedication = (medicationId) => {
    setMedications(medications.filter((med) => med.id !== medicationId))
    setPatients(
      patients.map((patient) => ({
        ...patient,
        medications: patient.medications.filter((medName) => {
          const medToDelete = medications.find((m) => m.id === medicationId)
          return medToDelete ? medName !== medToDelete.name : true
        }),
      })),
    )
  }

  const assignMedicationToPatient = (patientId, medicationName, dosage, notes) => {
    const medication = medications.find((med) => med.name === medicationName)
    if (medication) {
      setPatients(
        patients.map((patient) =>
          patient.id === patientId
            ? {
                ...patient,
                medications: [
                  ...patient.medications,
                  {
                    name: medicationName,
                    dosage: dosage || medication.dosage,
                    frequency: medication.frequency,
                    notes: notes || "",
                  },
                ],
              }
            : patient,
        ),
      )
    }
    // Reset form
    setSelectedMedicationForAssignment("")
    setAssignmentDosage("")
    setAssignmentNotes("")
  }

  const removeMedicationFromPatient = (patientId, medicationName) => {
    setPatients(
      patients.map((patient) =>
        patient.id === patientId
          ? { ...patient, medications: patient.medications.filter((med) => med.name !== medicationName) }
          : patient,
      ),
    )
  }

  const scheduleConsultation = async (consultationId) => {
    try {
      const response = await setScheduleConsultation(consultationId);
      if (response.status) {
        console.log("Consultation scheduled successfully");
        getPendingConsultations().then(setConsultations).catch(console.error);
      } else {
        console.error("Failed to schedule consultation:", response.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refreshData = () => {
    // In a real app, this would fetch fresh data from the API
    
    // For now, we'll just trigger a re-render by updating state
    getPatients().then(setPatients).catch(console.error);
    getPendingConsultations().then(setConsultations).catch(console.error);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Cardiology Dashboard</h1>
              <p className="text-sm text-slate-600">Dr. Cardiologist - Heart Specialist</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-700 border-green-200">
              {patients.length} Active Patients
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-200">
              {medications.length} Medications
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patients
            </TabsTrigger>
            {/* <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </TabsTrigger> */}
            <TabsTrigger value="consultations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Consultations
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Patient List</h2>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid gap-4">
              {patients.map((patient) => (
                <Card key={patient.patientID} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{patient.email}</CardTitle>
                        <CardDescription>
                          <Badge className={getAdditionalInfoColor(patient.isHavingHypertension)}>{patient.isSmoker == "" ? "No data" : "Hypertension"}</Badge> • <Badge className={getAdditionalInfoColor(patient.isSmoker)}>{patient.isSmoker == "" ? "No data" : "Smoker"}</Badge> • <Badge className={getCholesterolColor(patient.cholesterolLevel)}>{patient.cholesterolLevel == "" ? "No data" : patient.cholesterolLevel}</Badge>  • Last visit: {patient.last_visit == null ? "-" : patient.last_visit} 
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getClassificationColor(patient.classification)}>{patient.classification == 0 ? "Healthy" : "Not Healthy"}</Badge>
                        {/* <Badge className={getStatusColor(patient.status)}>{patient.status.replace("_", " ")}</Badge> */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Current Medications</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {patient.medications.map((med, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Badge variant="secondary">
                                {med.name} - {med.dosage}
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                                  >
                                    <Info className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Medication Details</DialogTitle>
                                    <DialogDescription>
                                      Information about {med.name} for {patient.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Medication Name</Label>
                                        <p className="text-sm text-slate-600">{med.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Dosage</Label>
                                        <p className="text-sm text-slate-600">{med.dosage}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Frequency</Label>
                                        <p className="text-sm text-slate-600">{med.frequency}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Patient</Label>
                                        <p className="text-sm text-slate-600">{patient.name}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Notes & Instructions</Label>
                                      <p className="text-sm text-slate-600 mt-1 p-3 bg-slate-50 rounded-md">
                                        {med.notes || "No additional notes"}
                                      </p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                onClick={() => removeMedicationFromPatient(patient.id, med.name)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Medication Management</CardTitle>
                    <CardDescription>Add, update, and manage medications</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Medication
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Medication</DialogTitle>
                        <DialogDescription>Enter the details for the new medication</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Medication Name</Label>
                          <Input
                            id="name"
                            value={newMedication.name}
                            onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                            placeholder="e.g., Lisinopril"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            value={newMedication.dosage}
                            onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                            placeholder="e.g., 10mg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="frequency">Frequency</Label>
                          <Input
                            id="frequency"
                            value={newMedication.frequency}
                            onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                            placeholder="e.g., 1x daily"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={newMedication.category}
                            onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value })}
                            placeholder="e.g., ACE Inhibitor"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newMedication.stock}
                            onChange={(e) => setNewMedication({ ...newMedication, stock: e.target.value })}
                            placeholder="e.g., 100"
                          />
                        </div>
                        <Button onClick={addMedication} className="w-full">
                          Add Medication
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {medications.map((medication) => (
                    <Card key={medication.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{medication.name}</h3>
                            <p className="text-sm text-slate-600">
                              {medication.dosage} • {medication.frequency} • {medication.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">Stock: {medication.stock}</Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingMedication({ ...medication })}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Medication</DialogTitle>
                                  <DialogDescription>Update medication details</DialogDescription>
                                </DialogHeader>
                                {editingMedication && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Medication Name</Label>
                                      <Input
                                        value={editingMedication.name}
                                        onChange={(e) =>
                                          setEditingMedication({ ...editingMedication, name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Dosage</Label>
                                      <Input
                                        value={editingMedication.dosage}
                                        onChange={(e) =>
                                          setEditingMedication({ ...editingMedication, dosage: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Frequency</Label>
                                      <Input
                                        value={editingMedication.frequency}
                                        onChange={(e) =>
                                          setEditingMedication({ ...editingMedication, frequency: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Category</Label>
                                      <Input
                                        value={editingMedication.category}
                                        onChange={(e) =>
                                          setEditingMedication({ ...editingMedication, category: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Stock Quantity</Label>
                                      <Input
                                        type="number"
                                        value={editingMedication.stock}
                                        onChange={(e) =>
                                          setEditingMedication({ ...editingMedication, stock: e.target.value })
                                        }
                                      />
                                    </div>
                                    <Button onClick={updateMedication} className="w-full">
                                      Update Medication
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteMedication(medication.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Patient List</h2>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Patient Consultations</CardTitle>
                <CardDescription>Assign medications or schedule consultations for patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <Card key={consultation.patientID} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{consultation.email}</h3>
                            <p className="text-sm text-slate-600">
                              <Badge className={getAdditionalInfoColor(consultation.isHavingHypertension)}>{consultation.isHavingHypertension == "" ? "No data" : "Hypertension"}</Badge> • <Badge className={getAdditionalInfoColor(consultation.isSmoker)}>{consultation.isSmoker == "" ? "No data" : "Smoker"}</Badge> • <Badge className={getCholesterolColor(consultation.cholesterolLevel)}>{consultation.cholesterolLevel == "" ? "No data" : consultation.cholesterolLevel}</Badge>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(consultation)}>
                                  <Pill className="h-4 w-4 mr-1" />
                                  Assign Medication
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Medication to {consultation.name}</DialogTitle>
                                  <DialogDescription>
                                    Select a medication, specify dosage and add consultation notes
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Select Medication</Label>
                                    <Select
                                      value={selectedMedicationForAssignment}
                                      onValueChange={setSelectedMedicationForAssignment}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select medication" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {medications.map((med) => (
                                          <SelectItem key={med.id} value={med.name}>
                                            {med.name} - {med.dosage} ({med.frequency})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Dosage for Patient</Label>
                                    <Input
                                      placeholder="e.g., 10mg, 25mg"
                                      value={assignmentDosage}
                                      onChange={(e) => setAssignmentDosage(e.target.value)}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave empty to use default dosage</p>
                                  </div>
                                  <div>
                                    <Label>Consultation Notes & Instructions</Label>
                                    <Textarea
                                      placeholder="Add consultation notes and medication instructions..."
                                      value={assignmentNotes}
                                      onChange={(e) => setAssignmentNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                  <Button
                                    className="w-full"
                                    onClick={() =>
                                      assignMedicationToPatient(
                                        consultation.patientID,
                                        selectedMedicationForAssignment,
                                        assignmentDosage,
                                        assignmentNotes,
                                      )
                                    }
                                    disabled={!selectedMedicationForAssignment}
                                  >
                                    Assign Medication
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => scheduleConsultation(consultation.consultation_id)}
                              // className={
                              //   patient.severity === "severe" ? "text-red-600 border-red-200 hover:bg-red-50" : ""
                              // }
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule Consultation
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label className="text-sm font-medium text-slate-700">Current Medications</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {consultation.medications.map((med, index) => (
                              <Badge key={index} variant="secondary">
                                {med.name} - {med.dosage}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

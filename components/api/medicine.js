// utils/api/patient.js
import { apiFetch } from "../api";

export const getMedicines = async () => {
    return apiFetch("/api/medicines");
};

export const addMedicine = async (medName, dosage, category)=> {
    return apiFetch(`/api/medicine`, {
        method: "POST",
        body: JSON.stringify({ medName: medName, dosage: dosage, category: category }),
    });
};

export const updateMedicine = async (medID, medName, dosage, category)=> {
    return apiFetch(`/api/update-medicine`, {
        method: "POST",
        body: JSON.stringify({ medID: medID, medName: medName, dosage: dosage, category: category }),
    });
};


export const deleteMedicine = async (medID)=> {
    return apiFetch(`/api/medicine`, {
        method: "DELETE",
        body: JSON.stringify({ medID: medID}),
    });
};


export const deleteDetailMedicine = async (medID)=> {
    return apiFetch(`/api/detail-medicine`, {
        method: "DELETE",
        body: JSON.stringify({ detailID: medID}),
    });
};




export const addDetailMedicine = async (patientID, medID, frequency, notes)=> {
    return apiFetch(`/api/detail-medicine`, {
        method: "POST",
        body: JSON.stringify({ medID: medID, patientID: patientID, frequency: frequency, notes: notes}),
    });
};
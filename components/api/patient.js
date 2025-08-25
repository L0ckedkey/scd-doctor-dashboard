// utils/api/patient.js
import { apiFetch } from "../api";

export const getPatients = async () => {
    return apiFetch("/api/patients");
};

export const getPendingConsultations = async () => {
    return apiFetch("/api/pending-consultations");
};

export const setScheduleConsultation = async (consultationId)=> {
    return apiFetch(`/api/schedule-consultation`, {
        method: "POST",
        body: JSON.stringify({ consultationID: consultationId }),
    });
};

export const createPatient = async (data) => {
    return apiFetch("/patients", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

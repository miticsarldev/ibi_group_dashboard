import { Allocation, Driver, Vehicle } from "@/types";

const vehicles: Vehicle[] = [
  {
    id: 1,
    type: "car",
    plate: "BA 1234 MD",
    status: "En service",
    position: [12.6392, -8.0029],
    Vnumber: "AX123456",
  },
  {
    id: 2,
    type: "bike",
    plate: "BA 5678 MC",
    status: "En service",
    position: [12.6429, -7.9913],
    Vnumber: "AX454656",
  },
  {
    id: 3,
    type: "car",
    plate: "BA 9012 MD",
    status: "En service",
    position: [12.6501, -8.0072],
    Vnumber: "AX789012",
  },
  {
    id: 4,
    type: "bike",
    plate: "BA 3456 MC",
    status: "En service",
    position: [12.6367, -8.02],
    Vnumber: "BM789012",
  },
  {
    id: 5,
    type: "car",
    plate: "BA 7890 MD",
    status: "En service",
    position: [12.6532, -7.9867],
    Vnumber: "CY123456",
  },
  {
    id: 6,
    type: "car",
    plate: "BA 2468 MD",
    status: "En service",
    position: [12.645, -8.01],
    Vnumber: "CY789012",
  },
  {
    id: 7,
    type: "bike",
    plate: "BA 1357 MC",
    status: "En service",
    position: [12.63, -7.995],
    Vnumber: "CY345678",
  },
  {
    id: 8,
    type: "car",
    plate: "BA 8642 MD",
    status: "En service",
    position: [12.66, -8.015],
    Vnumber: "DZ123456",
  },
  {
    id: 9,
    type: "bike",
    plate: "BA 9753 MC",
    status: "En service",
    position: [12.625, -7.98],
    Vnumber: "DZ567890",
  },
  {
    id: 10,
    type: "car",
    plate: "BA 1593 MD",
    status: "En service",
    position: [12.67, -8.025],
    Vnumber: "DZ789012",
  },
];

const drivers: Driver[] = [
  {
    id: 1,
    name: "Amadou Diallo",
    email: "amadou.diallo@example.ml",
    image:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
    phone: "+22370012345",
    address: "Quartier ACI 2000, Bamako",
    isActive: true,
    licenseNumber: "ML-2345-6789",
    status: "Active",
    experienceYears: 5,
    rating: 4.7,
    joinedDate: "2018-06-15T09:00:00Z",
  },
  {
    id: 2,
    name: "Fatoumata Touré",
    email: "fatoumata.toure@example.ml",
    image:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
    phone: "+22370123456",
    address: "Quartier Hippodrome, Bamako",
    isActive: true,
    licenseNumber: "ML-3456-7890",
    status: "Active",
    experienceYears: 3,
    rating: 4.5,
    joinedDate: "2020-04-10T08:00:00Z",
  },
  {
    id: 3,
    name: "Oumar Keita",
    email: "oumar.keita@example.ml",
    phone: "+22370234567",
    address: "Quartier Lafiabougou, Bamako",
    isActive: true,
    licenseNumber: "ML-4567-8901",
    status: "Active",
    experienceYears: 7,
    rating: 4.8,
    joinedDate: "2016-02-20T12:00:00Z",
  },
  {
    id: 4,
    name: "Aminata Traoré",
    email: "aminata.traore@example.ml",
    phone: "+22370345678",
    address: "Quartier Badalabougou, Bamako",
    isActive: true,
    licenseNumber: "ML-5678-9012",
    status: "Active",
    experienceYears: 2,
    rating: 4.6,
    joinedDate: "2022-01-15T10:30:00Z",
  },
  {
    id: 5,
    name: "Ibrahim Coulibaly",
    email: "ibrahim.coulibaly@example.ml",
    phone: "+22370456789",
    address: "Quartier Faso Kanu, Bamako",
    isActive: true,
    licenseNumber: "ML-6789-0123",
    status: "Active",
    experienceYears: 4,
    rating: 4.9,
    joinedDate: "2019-08-10T14:00:00Z",
  },
  {
    id: 6,
    name: "Mariam Sissoko",
    email: "mariam.sissoko@example.ml",
    phone: "+22370567890",
    address: "Quartier Kalaban Coura, Bamako",
    isActive: true,
    licenseNumber: "ML-7890-1234",
    status: "Active",
    experienceYears: 6,
    rating: 4.7,
    joinedDate: "2017-11-05T11:00:00Z",
  },
  {
    id: 7,
    name: "Seydou Coulibaly",
    email: "seydou.coulibaly@example.ml",
    phone: "+22370678901",
    address: "Quartier Magnambougou, Bamako",
    isActive: true,
    licenseNumber: "ML-8901-2345",
    status: "Active",
    experienceYears: 8,
    rating: 4.8,
    joinedDate: "2015-09-20T10:00:00Z",
  },
  {
    id: 8,
    name: "Kadiatou Camara",
    email: "kadiatou.camara@example.ml",
    phone: "+22370789012",
    address: "Quartier Banconi, Bamako",
    isActive: true,
    licenseNumber: "ML-9012-3456",
    status: "Active",
    experienceYears: 3,
    rating: 4.5,
    joinedDate: "2020-07-01T09:30:00Z",
  },
  {
    id: 9,
    name: "Moussa Sanogo",
    email: "moussa.sanogo@example.ml",
    phone: "+22370890123",
    address: "Quartier Niamakoro, Bamako",
    isActive: true,
    licenseNumber: "ML-0123-4567",
    status: "Active",
    experienceYears: 5,
    rating: 4.6,
    joinedDate: "2018-03-15T08:45:00Z",
  },
  {
    id: 10,
    name: "Aïcha Touré",
    email: "aicha.toure@example.ml",
    phone: "+22370901234",
    address: "Quartier Hamdallaye, Bamako",
    isActive: true,
    licenseNumber: "ML-1234-5678",
    status: "Active",
    experienceYears: 4,
    rating: 4.7,
    joinedDate: "2019-11-10T13:15:00Z",
  },
];

const allocations: Allocation[] = [
  {
    id: 1,
    driver: 1,
    vehicle: 1,
    startDate: "2024-11-15T08:00:00Z",
    endDate: "2024-11-16T18:00:00Z",
    status: "En cours",
    isPaid: true,
    type: "Transport",
    notes: "Transport de marchandises à Ségou.",
  },
  {
    id: 2,
    driver: 2,
    vehicle: 2,
    startDate: "2024-11-15T07:30:00Z",
    endDate: "2024-11-16T19:00:00Z",
    status: "En cours",
    isPaid: true,
    type: "Mission",
    notes: "Livraison express dans Bamako.",
  },
  {
    id: 3,
    driver: 3,
    vehicle: 3,
    startDate: "2024-11-15T09:00:00Z",
    endDate: "2024-11-17T17:30:00Z",
    status: "En cours",
    isPaid: false,
    type: "Transport",
    notes: "Transport de passagers à Kayes.",
  },
  {
    id: 4,
    driver: 4,
    vehicle: 4,
    startDate: "2024-11-15T06:00:00Z",
    endDate: "2024-11-16T16:00:00Z",
    status: "En cours",
    isPaid: true,
    type: "Transport",
    notes: "Livraison de colis à Mopti.",
  },
  {
    id: 5,
    driver: 5,
    vehicle: 5,
    startDate: "2024-11-15T10:00:00Z",
    endDate: "2024-11-16T20:00:00Z",
    status: "En cours",
    type: "Transport",
    isPaid: false,
    notes: "Supervision de projet à Sikasso.",
  },
  {
    id: 6,
    driver: 6,
    vehicle: 6,
    startDate: "2024-11-15T08:30:00Z",
    endDate: "2024-11-16T18:30:00Z",
    status: "En cours",
    isPaid: false,
    type: "Mission",
    notes: "Visite de chantiers à Koulikoro.",
  },
  {
    id: 7,
    driver: 7,
    vehicle: 7,
    startDate: "2024-11-15T07:00:00Z",
    endDate: "2024-11-16T17:00:00Z",
    isPaid: true,
    status: "En cours",
    type: "Transport",
    notes: "Livraison de médicaments à Kati.",
  },
  {
    id: 8,
    driver: 8,
    vehicle: 8,
    startDate: "2024-11-15T09:30:00Z",
    endDate: "2024-11-17T19:30:00Z",
    status: "En cours",
    isPaid: true,
    type: "Transport",
    notes: "Transport de matériaux de construction à Gao.",
  },
  {
    id: 9,
    driver: 9,
    vehicle: 9,
    startDate: "2024-11-15T08:15:00Z",
    endDate: "2024-11-16T18:15:00Z",
    status: "En cours",
    isPaid: true,
    type: "Mission",
    notes: "Inspection des installations à Koutiala.",
  },
  {
    id: 10,
    driver: 10,
    vehicle: 10,
    startDate: "2024-11-15T10:30:00Z",
    endDate: "2024-11-16T20:30:00Z",
    status: "En cours",
    type: "Transport",
    isPaid: true,
    notes: "Livraison de produits agricoles à Ségou.",
  },
];

export { vehicles, drivers, allocations };

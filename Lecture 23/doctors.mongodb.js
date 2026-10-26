use("HospitalDB")

// db.doctors.insertMany([
//     {
//         name: "Dr. Punit",
//         specialty: "Cardiology",
//         yearsOfExperience: 15,
//         available: true,
//         fees: 2500,
//         salary: 150000,
//         patients: ["John Doe", "Jane Doe"],
//         contact: { phone: "123-456-7890", email: "dr.punit@hospital.com" },
//     },
//     {
//         name: "Dr. Mansi",
//         specialty: "Dermatology",
//         yearsOfExperience: 10,
//         available: true,
//         fees: 1500,
   //         salary: 400000,
//         patients: ["Alice Brown", "Bob Green"],
//         contact: { phone: "098-765-4321", email: "dr.mansi@hospital.com" }
//     },
//     {
//         name: "Dr. Ramesh",
//         specialty: "Neurology",
//         yearsOfExperience: 20,
//         available: true,
//         fees: 2000,
//         salary: 200000,
//         patients: ["Charlie Black", "Diana White"],
//         contact: { phone: "555-123-4567", email: "dr.ramesh@hospital.com" }
//     }
// ])

db.doctors.aggregate(
    [
        {
            $match: { specialty: "Cardiology" }
        },
        {
            $project: {
                name: 1,
                specialty: 1,
                yearsOfExperience: 1,
            }
        },
        {
            $group: {
                _id: "$specialty",
                totalDoctors: { $sum: 1 },
                averageExperience: { $avg: "$yearsOfExperience" },

            }
        },
        {
            $sort: { averageExperience: -1 }
        }
    ]
)


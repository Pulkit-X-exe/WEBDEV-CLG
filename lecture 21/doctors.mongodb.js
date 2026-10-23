use("HospitalDB")

// create operation
// 1.insert method 
// 2.insert one document
// 3. insert many documents

// db.doctors.insert({ name: "Dr. Smith",
//     specialty: "Cardiology",
//     yearsOfExperience: 15,
//     available: true ,
//     patients: ["John Doe", "Jane Doe"] ,
//     contact: { phone: "123-456-7890", email: "dr.smith@hospital.com" } })

// db.insertOne({
//     name: "Dr. Johnson",
//     specialty: "Dermatology",
//     yearsOfExperience: 10,
//     available: true,
//     patients: ["Alice Brown", "Bob Green"],
//     contact: { phone: "098-765-4321", email: "dr.johnson@hospital.com" }
// })

db.doctors.insertMany([
    {
        name: "Dr. Williams",
        specialty: "Neurology",
        yearsOfExperience: 20,
        available: true,
        fees: 2000,
        patients: ["Charlie Black", "Diana White"],
        contact: { phone: "555-123-4567", email: "dr.williams@hospital.com" }},
    {
        name: "Dr. Brown",
        specialty: "Pediatrics",
        yearsOfExperience: 8,
        available: false,
        fees: 1200,
        patients: ["Ethan Gray", "Fiona Blue"],
        contact: { phone: "555-987-6543", email: "dr.brown@hospital.com" }
    },
    {
        name: "Dr. Davis",
        specialty: "Dermatology",   
        yearsOfExperience: 12,
        available: true,
        fees: 1500,
        patients: ["George Yellow", "Helen Purple"],
        contact: { phone: "555-456-7890", email: "dr.davis@hospital.com" }
    },
    {
        name: "Dr. Miller",
        specialty: "Bariatrics",
        yearsOfExperience: 18,
        available: true,
        fees: 1800,
        patients: ["Ian Orange", "Julia Red"],
        contact: { phone: "555-234-5678", email: "dr.miller@hospital.com" }
    },
    {
        name: "Dr. Wilson",
        specialty: "Cardiology",
        yearsOfExperience: 15,
        available: true,
        fees: 2000,
        patients: ["Kevin Green", "Laura Blue"],
        contact: { phone: "555-123-4567", email: "dr.wilson@hospital.com" }
    }
])

// db.doctors.find(
//     {
//         $or: [
//             {specialty: "Cardiology"},
//             {fees: { $gt: 1000 }}
//         ]
//     }
// )

// db.doctors.find({}, { name: 1, specialty: 1, fees: 1, _id: 0 })

// db.doctors.find().limit(2)
// db.doctors.find().skip(2).limit(2)

db.doctors.find().sort({ yearsOfExperience: -1 })
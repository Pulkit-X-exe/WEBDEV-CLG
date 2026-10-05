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
        patients: ["Charlie Black", "Diana White"],
        contact: { phone: "555-123-4567", email: "dr.williams@hospital.com" }},
    {
        name: "Dr. Brown",
        specialty: "Pediatrics",
        yearsOfExperience: 8,
        available: false,
        patients: ["Ethan Gray", "Fiona Blue"],
        contact: { phone: "555-987-6543", email: "dr.brown@hospital.com" }
    }
])

db.doctors.find()
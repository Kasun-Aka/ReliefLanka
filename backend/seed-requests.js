/**
 * seed-requests.js
 * Inserts 20 realistic Sri Lankan disaster-relief requests into MongoDB.
 *
 * Usage (from the /backend directory):
 *   node seed-requests.js
 *
 * Safe to run multiple times — it checks for existing records first and
 * only seeds if the collection is empty. Use --force to always reseed.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Request  = require("./models/Request");

const FORCE = process.argv.includes("--force");

const SEED_REQUESTS = [
  {
    name: "Nuwan Perera",
    district: "Ratnapura",
    contactPhone: "077 214 8890",
    itemsNeeded: ["Drinking water", "Baby formula", "Blankets", "Diapers"],
    peopleAffected: 24,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Fathima Rizwan",
    district: "Batticaloa",
    contactPhone: "071 660 3312",
    itemsNeeded: ["Insulin", "First aid kits", "Bandages"],
    peopleAffected: 6,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Kamal Jayasinghe",
    district: "Kalutara",
    contactPhone: "076 118 2044",
    itemsNeeded: ["Dry rations", "Cooking gas", "Kerosene"],
    peopleAffected: 41,
    urgency: "Medium",
    status: "Pending",
  },
  {
    name: "Thavaraj Selvam",
    district: "Trincomalee",
    contactPhone: "070 553 7781",
    itemsNeeded: ["Tarpaulin sheets", "Mosquito nets", "Rope"],
    peopleAffected: 18,
    urgency: "Medium",
    status: "Pending",
  },
  {
    name: "Sanduni Wickrama",
    district: "Colombo",
    contactPhone: "077 902 1145",
    itemsNeeded: ["Drinking water", "Sanitary pads"],
    peopleAffected: 12,
    urgency: "High",
    status: "Fulfilled",
  },
  {
    name: "Ravi Bandara",
    district: "Kegalle",
    contactPhone: "075 447 9020",
    itemsNeeded: ["School supplies", "Clothing", "Shoes"],
    peopleAffected: 30,
    urgency: "Low",
    status: "Pending",
  },
  {
    name: "Ayesha Nizam",
    district: "Gampaha",
    contactPhone: "071 233 6650",
    itemsNeeded: ["Dry rations", "Drinking water", "Sanitary items"],
    peopleAffected: 55,
    urgency: "High",
    status: "Fulfilled",
  },
  {
    name: "Dinesh Kumara",
    district: "Matara",
    contactPhone: "078 771 4408",
    itemsNeeded: ["Water purification tablets", "Oral rehydration salts"],
    peopleAffected: 9,
    urgency: "Medium",
    status: "Fulfilled",
  },
  {
    name: "Priyantha Dissanayake",
    district: "Hambantota",
    contactPhone: "072 391 0056",
    itemsNeeded: ["Rice", "Dhal", "Canned fish", "Coconut oil"],
    peopleAffected: 67,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Malini Samaraweera",
    district: "Galle",
    contactPhone: "077 502 8831",
    itemsNeeded: ["Baby food", "Milk powder", "Pampers"],
    peopleAffected: 8,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Saman Rajapaksha",
    district: "Ampara",
    contactPhone: "070 114 2293",
    itemsNeeded: ["Generator fuel", "Candles", "Torches", "Batteries"],
    peopleAffected: 120,
    urgency: "Medium",
    status: "Pending",
  },
  {
    name: "Nirosha Fernando",
    district: "Kurunegala",
    contactPhone: "076 663 9940",
    itemsNeeded: ["Paracetamol", "Antiseptic cream", "Cotton"],
    peopleAffected: 14,
    urgency: "Medium",
    status: "Pending",
  },
  {
    name: "Mohamed Ismail",
    district: "Puttalam",
    contactPhone: "071 887 5523",
    itemsNeeded: ["Tent", "Sleeping bags", "Warm clothing"],
    peopleAffected: 33,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Chaminda Weerasinghe",
    district: "Polonnaruwa",
    contactPhone: "075 320 4417",
    itemsNeeded: ["Drinking water", "Dry rations", "Candles"],
    peopleAffected: 22,
    urgency: "Low",
    status: "Pending",
  },
  {
    name: "Kumari Abeysekara",
    district: "Kandy",
    contactPhone: "077 781 3302",
    itemsNeeded: ["Wheelchair", "Walking sticks", "Medicines for elderly"],
    peopleAffected: 5,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Asela Pathirana",
    district: "Monaragala",
    contactPhone: "070 445 6671",
    itemsNeeded: ["Rice", "Dried fish", "Sugar", "Tea"],
    peopleAffected: 78,
    urgency: "Medium",
    status: "Pending",
  },
  {
    name: "Dilrukshi Jayawardena",
    district: "Badulla",
    contactPhone: "071 993 1188",
    itemsNeeded: ["Sanitary napkins", "Soap", "Toothbrushes", "Detergent"],
    peopleAffected: 40,
    urgency: "Low",
    status: "Pending",
  },
  {
    name: "Suresh Krishnan",
    district: "Jaffna",
    contactPhone: "076 224 8893",
    itemsNeeded: ["Blood pressure medication", "Insulin", "Syringes"],
    peopleAffected: 11,
    urgency: "High",
    status: "Pending",
  },
  {
    name: "Chandra Perumal",
    district: "Mannar",
    contactPhone: "071 556 7720",
    itemsNeeded: ["Fishing nets", "Boat repair materials", "Fuel"],
    peopleAffected: 46,
    urgency: "Medium",
    status: "Fulfilled",
  },
  {
    name: "Rukshini Balakrishnan",
    district: "Vavuniya",
    contactPhone: "070 338 9954",
    itemsNeeded: ["Baby formula", "Diapers", "Paracetamol", "Drinking water"],
    peopleAffected: 19,
    urgency: "High",
    status: "Pending",
  },
];

async function seed() {
  console.log("🌐  Connecting to MongoDB Atlas…");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected.\n");

  const existing = await Request.countDocuments();

  if (existing > 0 && !FORCE) {
    console.log(
      `ℹ️   Collection already has ${existing} request(s). Skipping seed.\n` +
      "    Run with --force to overwrite.\n"
    );
    await mongoose.disconnect();
    return;
  }

  if (FORCE && existing > 0) {
    console.log(`🗑️   --force flag set. Dropping ${existing} existing request(s)…`);
    await Request.deleteMany({});
    console.log("    Cleared.\n");
  }

  console.log(`🌱  Seeding ${SEED_REQUESTS.length} relief requests…\n`);

  const results = [];
  for (const payload of SEED_REQUESTS) {
    // Spread createdAt across the past 72 hours for realistic timestamps
    const hoursBack = Math.floor(Math.random() * 72);
    const doc = await Request.create({
      ...payload,
      createdAt: new Date(Date.now() - hoursBack * 3_600_000),
    });
    results.push(doc.requestId);
    console.log(`   ✔  ${doc.requestId}  ${doc.name} — ${doc.district} (${doc.urgency})`);
  }

  console.log(`\n🎉  Done! ${results.length} requests inserted into MongoDB Atlas.\n`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});

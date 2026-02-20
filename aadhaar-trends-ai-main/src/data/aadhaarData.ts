// Synthetic anonymized Aadhaar biometric enrollment dataset

export interface EnrollmentRecord {
  state: string;
  district: string;
  pincode: string;
  month: string; // YYYY-MM
  biometric_count: number;
  bio_age_5_17: number;
  bio_age_17_plus: number;
}

const STATES_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada", "Anantapur", "Eluru"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Goalpara"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Raigarh"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Mehsana"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat", "Yamunanagar", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Hamirpur", "Una", "Bilaspur", "Nahan", "Chamba"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka", "Ramgarh"],
  "Karnataka": ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru (Dakshina Kannada)", "Belgaum (Belagavi)", "Dharwad", "Hubli", "Davangere", "Bellary (Ballari)", "Shimoga (Shivamogga)", "Tumkur (Tumakuru)", "Gulbarga (Kalaburagi)", "Raichur", "Bidar", "Yadgir", "Koppal", "Gadag", "Haveri", "Uttara Kannada (Karwar)", "Udupi", "Hassan", "Chikkamagaluru", "Kodagu (Coorg)", "Mandya", "Chamarajanagar", "Ramanagara", "Kolar", "Chikkaballapur", "Chitradurga", "Vijayapura (Bijapur)", "Bagalkot"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Palakkad", "Malappuram", "Kottayam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Rewa", "Ratlam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada", "Jharsuguda", "Jeypore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Firozpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Bhilwara", "Alwar", "Sikar", "Pali"],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Rangpo", "Singtam"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Ambassa"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Noida", "Prayagraj", "Meerut", "Ghaziabad", "Bareilly", "Aligarh"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Kashipur", "Rudrapur", "Nainital", "Mussoorie"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Malda", "Kharagpur", "Haldia", "Baharampur"],
};

export const STATES = Object.keys(STATES_DISTRICTS);
export const getDistricts = (state: string) => STATES_DISTRICTS[state] || [];

const MONTHS = [
  "2024-01","2024-02","2024-03","2024-04","2024-05","2024-06",
  "2024-07","2024-08","2024-09","2024-10","2024-11","2024-12",
  "2025-01","2025-02","2025-03","2025-04","2025-05","2025-06",
  "2025-07","2025-08","2025-09","2025-10","2025-11","2025-12",
];

// Seeded pseudo-random
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateData(): EnrollmentRecord[] {
  const data: EnrollmentRecord[] = [];
  let seed = 42;

  for (const state of STATES) {
    const stateBase = 5000 + seededRandom(seed++)() * 15000;
    for (const district of STATES_DISTRICTS[state]) {
      const distBase = stateBase * (0.15 + seededRandom(seed++)() * 0.3);
      const rng = seededRandom(seed++);

      for (let i = 0; i < MONTHS.length; i++) {
        const month = MONTHS[i];
        const monthIdx = parseInt(month.split("-")[1]);
        
        // Seasonal pattern: higher in Jan-Mar, lower in Jun-Aug
        const seasonal = monthIdx <= 3 ? 1.2 : monthIdx <= 5 ? 1.0 : monthIdx <= 8 ? 0.8 : 1.05;
        // Slight upward trend
        const trend = 1 + i * 0.008;
        // Random noise
        const noise = 0.85 + rng() * 0.3;
        // Occasional spike/drop
        const anomaly = rng() > 0.92 ? (rng() > 0.5 ? 1.6 : 0.5) : 1;

        const count = Math.round(distBase * seasonal * trend * noise * anomaly);
        const youngRatio = 0.2 + rng() * 0.15;

        data.push({
          state,
          district,
          pincode: `${400000 + Math.round(rng() * 200000)}`,
          month,
          biometric_count: count,
          bio_age_5_17: Math.round(count * youngRatio),
          bio_age_17_plus: Math.round(count * (1 - youngRatio)),
        });
      }
    }
  }

  return data;
}

export const enrollmentData = generateData();

export function getFilteredData(state: string, district?: string): EnrollmentRecord[] {
  return enrollmentData.filter(
    (r) => r.state === state && (!district || r.district === district)
  );
}

export function aggregateByMonth(records: EnrollmentRecord[]): { month: string; biometric_count: number; bio_age_5_17: number; bio_age_17_plus: number }[] {
  const map = new Map<string, { biometric_count: number; bio_age_5_17: number; bio_age_17_plus: number }>();
  
  for (const r of records) {
    const existing = map.get(r.month) || { biometric_count: 0, bio_age_5_17: 0, bio_age_17_plus: 0 };
    existing.biometric_count += r.biometric_count;
    existing.bio_age_5_17 += r.bio_age_5_17;
    existing.bio_age_17_plus += r.bio_age_17_plus;
    map.set(r.month, existing);
  }

  return Array.from(map.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

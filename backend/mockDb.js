import bcrypt from 'bcryptjs';

export const mockUsers = [
  {
    id: 'mock-user-bhumika',
    name: 'Bhumika Bahuguna',
    email: 'bhumika.farmer@example.com',
    password: '', // will be hashed on startup
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockCrops = [
  {
    id: 'crop-1',
    name: 'Rice',
    variety: 'Basmati 370',
    type: 'Grain',
    status: 'Growing',
    plantedDate: new Date('2026-06-01'),
    expectedHarvestDate: new Date('2026-10-15'),
    fieldArea: 5.5,
    userId: 'mock-user-bhumika'
  },
  {
    id: 'crop-2',
    name: 'Wheat',
    variety: 'Kalyan Sona',
    type: 'Grain',
    status: 'Planned',
    plantedDate: null,
    expectedHarvestDate: new Date('2027-04-10'),
    fieldArea: 8.0,
    userId: 'mock-user-bhumika'
  }
];

// Initialize password hash
(async () => {
  try {
    const salt = await bcrypt.genSalt(12);
    mockUsers[0].password = await bcrypt.hash('password123', salt);
  } catch (e) {
    console.error('Failed to hash mock password:', e);
  }
})();

// Helper to execute Prisma queries with a transparent in-memory database fallback
export const runDbQuery = async (prismaPromise, mockCallback) => {
  try {
    return await prismaPromise;
  } catch (error) {
    const errorMsg = error.message || '';
    const isConnError = 
      error.name === 'PrismaClientInitializationError' ||
      error.code === 'P1001' ||
      error.code === 'P1002' ||
      error.code === 'P1003' ||
      errorMsg.includes('Can\'t reach database server') ||
      errorMsg.includes('unreachable') ||
      errorMsg.includes('connection');

    if (isConnError) {
      console.warn('⚠️ Supabase connection failed (likely paused or offline). Executing query on in-memory mock database.');
      return await mockCallback();
    }
    throw error;
  }
};

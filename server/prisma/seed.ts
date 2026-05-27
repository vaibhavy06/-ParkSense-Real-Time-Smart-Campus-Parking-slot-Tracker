import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ParkSense database (SQLite)...');

  // 1. Clean existing database
  await prisma.entryLog.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.slot.deleteMany({});
  await prisma.zone.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashFaculty = await bcrypt.hash('faculty123', 10);
  const passwordHashStudent1 = await bcrypt.hash('student123', 10);
  const passwordHashStudent2 = await bcrypt.hash('student123', 10);
  const passwordHashGuard = await bcrypt.hash('guard123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Akhilesh Kumar (Director)',
      email: 'admin@parksense.in',
      password: passwordHashAdmin,
      role: 'ADMIN',
    },
  });

  const faculty = await prisma.user.create({
    data: {
      name: 'Prof. Rajesh Yadav (HOD CSE)',
      email: 'faculty@parksense.in',
      password: passwordHashFaculty,
      role: 'FACULTY',
      vehicleNo: 'UP32CS9999',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Vaibhav Yadav',
      email: 'student1@parksense.in',
      password: passwordHashStudent1,
      role: 'STUDENT',
      vehicleNo: 'UP32AB1234',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Anjali Sharma',
      email: 'student2@parksense.in',
      password: passwordHashStudent2,
      role: 'STUDENT',
      vehicleNo: 'UP16CD5678',
    },
  });

  const guard = await prisma.user.create({
    data: {
      name: 'Subedar Singh (Head Guard)',
      email: 'guard@parksense.in',
      password: passwordHashGuard,
      role: 'GUARD',
    },
  });

  console.log('Users seeded.');

  // 3. Create Zones
  const zoneA = await prisma.zone.create({
    data: {
      name: 'Zone A - Main Gate',
      totalSlots: 30,
      allowedRoles: 'STUDENT,FACULTY,GUARD,ADMIN',
    },
  });

  const zoneB = await prisma.zone.create({
    data: {
      name: 'Zone B - Academic Block',
      totalSlots: 25,
      allowedRoles: 'STUDENT,FACULTY,GUARD,ADMIN',
    },
  });

  const zoneC = await prisma.zone.create({
    data: {
      name: 'Zone C - Hostel & Canteen',
      totalSlots: 20,
      allowedRoles: 'STUDENT,FACULTY,GUARD,ADMIN',
    },
  });

  const zoneFaculty = await prisma.zone.create({
    data: {
      name: 'Zone D - Faculty Block',
      totalSlots: 15,
      allowedRoles: 'FACULTY,ADMIN',
    },
  });

  console.log('Zones seeded.');

  // Helper to generate slots
  const slotsData: {
    slotCode: string;
    zoneId: string;
    status: string;
    x: number;
    y: number;
  }[] = [];

  // Zone A - Main Gate (30 slots: A-01 to A-30)
  for (let i = 0; i < 30; i++) {
    const isRow2 = i >= 15;
    const colIndex = i % 15;
    slotsData.push({
      slotCode: `A-${String(i + 1).padStart(2, '0')}`,
      zoneId: zoneA.id,
      status: 'AVAILABLE',
      x: 75 + colIndex * 33,
      y: isRow2 ? 140 : 80,
    });
  }

  // Zone B - Academic Block (25 slots: B-01 to B-25)
  for (let i = 0; i < 25; i++) {
    const isRow2 = i >= 13;
    const colIndex = isRow2 ? i - 13 : i;
    slotsData.push({
      slotCode: `B-${String(i + 1).padStart(2, '0')}`,
      zoneId: zoneB.id,
      status: 'AVAILABLE',
      x: 75 + colIndex * 33,
      y: isRow2 ? 260 : 200,
    });
  }

  // Zone C - Hostel/Canteen (20 slots: C-01 to C-20)
  for (let i = 0; i < 20; i++) {
    const isRow2 = i >= 10;
    const colIndex = i % 10;
    slotsData.push({
      slotCode: `C-${String(i + 1).padStart(2, '0')}`,
      zoneId: zoneC.id,
      status: 'AVAILABLE',
      x: 75 + colIndex * 33,
      y: isRow2 ? 380 : 320,
    });
  }

  // Faculty Zone - Admin Block (15 slots: F-01 to F-15)
  for (let i = 0; i < 15; i++) {
    const isRow2 = i >= 8;
    const colIndex = isRow2 ? i - 8 : i;
    slotsData.push({
      slotCode: `F-${String(i + 1).padStart(2, '0')}`,
      zoneId: zoneFaculty.id,
      status: 'AVAILABLE',
      x: 75 + colIndex * 33,
      y: isRow2 ? 500 : 440,
    });
  }

  let occupiedCount = 0;
  let reservedCount = 0;
  const slots: any[] = [];

  for (let idx = 0; idx < slotsData.length; idx++) {
    const item = slotsData[idx];
    if (item.slotCode === 'A-01') {
      item.status = 'AVAILABLE';
    } else {
      const rand = Math.random();
      if (rand < 0.6 && occupiedCount < 54) {
        item.status = 'OCCUPIED';
        occupiedCount++;
      } else if (rand < 0.7 && reservedCount < 9) {
        item.status = 'RESERVED';
        reservedCount++;
      } else {
        item.status = 'AVAILABLE';
      }
    }

    const createdSlot = await prisma.slot.create({
      data: item,
    });
    slots.push(createdSlot);
  }

  console.log(`Slots seeded: ${slots.length} total. Occupied: ${occupiedCount}, Reserved: ${reservedCount}, Available: ${slots.length - occupiedCount - reservedCount}`);

  // 4. Create Active Reservations
  const reservedSlots = slots.filter((s) => s.status === 'RESERVED');
  const activeReservationUsers = [student1, student2, faculty];

  for (let i = 0; i < reservedSlots.length; i++) {
    const slot = reservedSlots[i];
    let user = activeReservationUsers[i % activeReservationUsers.length];
    
    if (slot.slotCode.startsWith('F')) {
      user = faculty;
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await prisma.reservation.create({
      data: {
        userId: user.id,
        slotId: slot.id,
        expiresAt,
        status: 'ACTIVE',
      },
    });
  }

  console.log('Active reservations created.');

  // 5. Create 50 Entry/Exit logs
  const actions = ['ENTRY', 'EXIT'];
  const vehicleList = ['UP32AB1234', 'UP16CD5678', 'UP32CS9999', 'DL3CFF8888', 'HR26XY5555', 'UP80AL0001', 'MH02BE9911'];
  
  console.log('Generating 50 entry/exit logs for the last 7 days...');
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.random() * 7;
    const timestamp = new Date();
    timestamp.setMilliseconds(timestamp.getMilliseconds() - daysAgo * 24 * 60 * 60 * 1000);

    const randomSlot = slots[Math.floor(Math.random() * slots.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const vehicleNo = vehicleList[Math.floor(Math.random() * vehicleList.length)];
    
    const userChoice = Math.random();
    let userId: string | null = null;
    if (userChoice < 0.3) userId = student1.id;
    else if (userChoice < 0.6) userId = student2.id;
    else if (userChoice < 0.8) userId = faculty.id;

    await prisma.entryLog.create({
      data: {
        slotId: randomSlot.id,
        userId,
        vehicleNo,
        action,
        timestamp,
      },
    });
  }

  console.log('Logs seeded successfully.');
  console.log('Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

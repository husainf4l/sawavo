import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      // Update password if it doesn't match
      const hashedPassword = await bcrypt.hash('tt55oo77', 12);
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword }
      });
      console.log('Admin password updated');
      return;
    }

        // Create admin user
    const hashedPassword = await bcrypt.hash('tt55oo77', 12);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@sawavo.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        isSystem: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    console.log('ID:', adminUser.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

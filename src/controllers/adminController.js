import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config: Use memory storage for processing images with Sharp
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const processImage = async (fileBuffer) => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const outputPath = path.join(uploadDir, filename);

  await sharp(fileBuffer)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return filename;
};

// Admin Management
export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, name: true, email: true, phone: true },
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

export const addAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        phone: phone,
        isActivated: true,
      },
    });
    res.json({ message: 'Admin created successfully', admin: { id: admin.id, name: admin.name, email: admin.email, phone: admin.phone } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// Service Management
export const addService = async (req, res) => {
  const { title, description, categoryId, features } = req.body;
  let image = '';

  try {
    if (req.file) {
      image = await processImage(req.file.buffer);
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        categoryId: parseInt(categoryId),
        features,
        image,
      },
    });
    res.json({ message: 'Service added successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Error adding service', error: error.message });
  }
};

export const updateService = async (req, res) => {
  const { id, title, description, categoryId, features } = req.body;
  let image;

  try {
    if (req.file) {
      image = await processImage(req.file.buffer);
    }

    const oldService = await prisma.service.findUnique({ where: { id: parseInt(id) } });
    
    // Delete old image if new one is uploaded
    if (image && oldService && oldService.image) {
      const oldImagePath = path.join(uploadDir, oldService.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        categoryId: parseInt(categoryId),
        features,
        ...(image && { image }),
      },
    });
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.body;
  try {
    const service = await prisma.service.findUnique({ where: { id: parseInt(id) } });
    if (service && service.image) {
      const imagePath = path.join(uploadDir, service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.service.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

// Category Management
export const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.json({ message: 'Category added successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id, name } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Cannot delete category with associated services' });
    }
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// Customer Management (Additional required by dashboard)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

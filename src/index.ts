import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import orderRoutes from './routes/orders';
import { initPrisma } from './prisma';

const app = express();

// ✅ Enable CORS globally
app.use(cors({
  origin: '*', // In production, set your frontend URL
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Load Swagger YAML
const swaggerDoc = YAML.load('./openapi.yaml');

// ✅ Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// ✅ API routes
app.use('/v1/auth', authRoutes);
app.use('/v1/customers', customerRoutes);
app.use('/v1/orders', orderRoutes);

// ✅ Start server
const port = process.env.PORT || 8000;
initPrisma()
  .then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch(err => {
    console.error('Prisma init error', err);
    app.listen(port, () => console.log(`Server running (no DB) on http://localhost:${port}`));
  });

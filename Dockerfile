FROM node:18-alpine

WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm install

# Copy backend source
COPY backend ./backend

# Build backend
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]

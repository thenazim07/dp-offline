FROM node:20.9.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm i -g pnpm
RUN pnpm install

# Copy the rest of your application's code
COPY . .

# Build your Nuxt.js application
RUN pnpm run build

# Install PM2 globally
RUN npm i -g pm2

# Expose the port the app runs on
EXPOSE 3000

CMD ["pnpm", "start"]
#CMD ["pnpm", "run", "dev"]

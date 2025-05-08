FROM node:23.5.0-alpine3.21

# Папка приложения
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Установка зависимостей
COPY package*.json ./
RUN npm install
RUN npm install -g vite
# Для использования в продакшне
# RUN npm install --production

COPY . .

# Build the Vite application
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Command to run the app
CMD "npm" "run" "preview"
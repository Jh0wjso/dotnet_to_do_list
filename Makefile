.PHONY: setup-backend setup-frontend start-backend start-frontend start-app kill-ports

build-backend:
	@echo "Building backend..."
	cd ToDoList.Api && dotnet build
	dotnet tool install --global dotnet-ef

setup-backend:
	@echo "Setting up backend..."
	@make build-backend
	cd ToDoList.Api && dotnet restore
	cd ToDoList.Api && dotnet ef database update

setup-frontend:
	@echo "Setting up frontend..."
	cd App && npm install

kill-ports:
	@echo "Killing processes on ports 5197 and 5173..."
	@-fuser -k 5197/tcp 2>/dev/null || true
	@-fuser -k 5173/tcp 2>/dev/null || true

start-backend:
	@echo "Starting backend..."
	cd ToDoList.Api && dotnet run

start-frontend:
	@echo "Starting frontend..."
	cd App && npm run dev

start-app: kill-ports
	@echo "Starting application..."
	@make start-backend & make start-frontend

.PHONY: setup-backend setup-frontend start-backend start-frontend start-app

setup-backend:
	@echo "Setting up backend..."
	cd ToDoList.Api && dotnet restore
	cd ToDoList.Api && dotnet ef database update

setup-frontend:
	@echo "Setting up frontend..."
	cd App && npm install

start-backend:
	@echo "Starting backend..."
	cd ToDoList.Api && dotnet run

start-frontend:
	@echo "Starting frontend..."
	cd App && npm run dev

start-app:
	@echo "Starting application..."
	@make start-backend & make start-frontend

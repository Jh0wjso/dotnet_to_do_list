# Running with Kubernetes (minikube)

## Prerequisites
- Docker
- minikube
- kubectl

## Steps

### 1. Build the images
```bash
docker build -t todo-api:latest ./ToDoList.Api/
docker build -t todo-app:latest ./App/
```

### 2. Create the namespace and apply manifests
```bash
kubectl apply -f namespace.yaml
kubectl apply -f k8s/
```

### 3. Load images into minikube
```bash
minikube image load todo-api:latest
minikube image load todo-app:latest
```

### 4. Restart deployments
```bash
kubectl rollout restart deployment -n todo
```

### 5. Expose the frontend
```bash
kubectl port-forward -n todo svc/todo-app 8080:80 --address 0.0.0.0
```

### 6. Allow port through firewall
```bash
sudo ufw allow 8080/tcp
```

## Accessing the app

- Same machine: `http://localhost:8080`
- Other devices on the network: `http://<your-local-ip>:8080`

To find your local IP:
```bash
hostname -I
```
Use the first IP (e.g. `192.168.2.105`).

> Note: Chrome may force HTTPS and block the connection. Use Safari or Firefox instead.

## Teardown

```bash
# Remove everything
kubectl delete namespace todo

# Revoke firewall rule
sudo ufw delete allow 8080/tcp
```

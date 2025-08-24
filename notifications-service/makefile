start:
	docker compose up -d --build

build:
	npm run build
	docker build -t josejaime5271/parker-notifications-service:latest --target=production .

push:
	docker push josejaime5271/parker-notifications-service:latest

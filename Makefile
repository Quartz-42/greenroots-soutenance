.PHONY: build up down clean ps logs restart artillery

# Construire les images
build:
	docker-compose build && docker-compose up

# Démarrer les conteneurs en arrière-plan
up:
	docker-compose up -d

# Démarrer les conteneurs avec les logs
up-logs:
	docker-compose up

# Arrêter les conteneurs
down:
	docker-compose down

# Arrêter et supprimer les conteneurs, réseaux et volumes
clean:
	docker-compose down -v --remove-orphans

# Afficher l'état des conteneurs
ps:
	docker-compose ps

# Afficher les logs des conteneurs
logs:
	docker-compose logs -f

# Redémarrer les conteneurs
restart:
	docker-compose restart

artillery:
	cd Backend/artillery && artillery run load-test.yml --record --key a9_qifnzcs1hno2gacha5pw4haa8z2mzxnv

# tests unitaires

# tests unitaires
test-unit:
	cd Backend/api_greenroots && npm run test

# tests e2e
test-e2e:
	cd Backend/api_greenroots && npm run test:e2e

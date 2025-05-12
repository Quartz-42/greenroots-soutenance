-- SQLBook: Code

BEGIN;

    CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        image VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Role" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS "UserRole" (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES "Role"(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Category" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255),
        image VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS "Product" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category INT NOT NULL,
        price FLOAT NOT NULL,
        stock INT NOT NULL,
        short_description TEXT,
        detailed_description TEXT,
        height VARCHAR(255),
        flower_color VARCHAR(255),
        flowering_period VARCHAR(255),
        watering_frequency VARCHAR(255),
        planting_period VARCHAR(255),
        exposure VARCHAR(255),
        hardiness VARCHAR(255),
        planting_distance VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category) REFERENCES "Category"(id)
    );
    
    CREATE TABLE IF NOT EXISTS "Purchase" (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        address VARCHAR(255) NOT NULL,
        postalCode VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        total FLOAT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_method VARCHAR(255) DEFAULT 'carte bancaire',
        status VARCHAR(50),
        stripe_id VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "PurchaseProduct" (
        id SERIAL PRIMARY KEY,
        purchase_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total FLOAT,
        FOREIGN KEY (purchase_id) REFERENCES "Purchase"(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES "Product"(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Image" (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        alt VARCHAR(255),
        product_id INT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES "Product"(id) ON DELETE CASCADE
    );

    INSERT INTO "Role" (name)
    VALUES ('Admin'), ('User');

    
COMMIT;
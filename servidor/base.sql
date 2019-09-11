DROP TABLE IF EXISTS productos;
CREATE TABLE productos(
	id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(45) NOT NULL UNIQUE,
	img VARCHAR(45) NOT NULL UNIQUE,
	estado TINYINT NOT NULL,
	selected TINYINT NOT NULL,
	PRIMARY KEY(id)

)ENGINE=INNODB;

INSERT productos (nombre, img, estado, selected) VALUES 
("Aceite", "aceite.jpg", 0, 0),
("Agua", "agua.jpg", 0, 0),
("Gaseosa", "gaseosa.jpg", 0, 0),
("Desodorante", "desodorante.jpg", 0, 0),
("Pan", "pan.jpg", 0, 0),
("Fideos", "fideos.jpg", 0, 0),
("Harina", "harina.jpg", 0, 0),
("Leche", "leche.jpg", 0, 0),
("Frutas", "frutas.jpg", 0, 0),
("Mayonesa", "mayonesa.jpg", 0, 0),
("Galletitas", "galletitas.jpg", 0, 0),
("Queso", "queso.jpg", 0, 0);


DROP TABLE IF EXISTS favoritos;
CREATE TABLE favoritos(
	id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
	producto_id TINYINT UNSIGNED NOT NULL UNIQUE,
	PRIMARY KEY(id),
	
	FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=INNODB;


DROP TABLE IF EXISTS listas;
CREATE TABLE listas(
	id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
	lista INT NOT NULL,
	producto_id TINYINT UNSIGNED NOT NULL,
	
	PRIMARY KEY(id),

	FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=INNODB;
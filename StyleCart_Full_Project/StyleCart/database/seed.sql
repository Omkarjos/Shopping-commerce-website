USE stylecart;
INSERT IGNORE INTO categories(name,slug) VALUES
('Kurtas','kurtas'),('Dresses','dresses'),('Accessories','accessories');

INSERT INTO products(category_id,name,description,price,image_url,stock)
SELECT c.id,'Printed Cotton Kurta','Comfortable everyday cotton kurta with a contemporary print.',899,
'https://images.unsplash.com/photo-1583391733956-6c78276477e8?w=800',20
FROM categories c WHERE c.slug='kurtas'
AND NOT EXISTS(SELECT 1 FROM products WHERE name='Printed Cotton Kurta');

INSERT INTO products(category_id,name,description,price,image_url,stock)
SELECT c.id,'Classic Anarkali Dress','A graceful occasion-ready Anarkali silhouette.',1899,
'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',12
FROM categories c WHERE c.slug='dresses'
AND NOT EXISTS(SELECT 1 FROM products WHERE name='Classic Anarkali Dress');

INSERT INTO products(category_id,name,description,price,image_url,stock)
SELECT c.id,'Everyday Tote Bag','A versatile carry-all for daily essentials.',599,
'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',30
FROM categories c WHERE c.slug='accessories'
AND NOT EXISTS(SELECT 1 FROM products WHERE name='Everyday Tote Bag');

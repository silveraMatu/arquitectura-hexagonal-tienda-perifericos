import { Product } from "../../../domain/entities/Product.js";
import { ProductId } from "../../../domain/value-objects/ProductId.js";
import { ProductName } from "../../../domain/value-objects/ProductName.js";
import { Price } from "../../../domain/value-objects/Price.js";
import { Stock } from "../../../domain/value-objects/Stock.js";

export function createSeedProducts(): Product[] {
  return [
    new Product({
      id: new ProductId("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
      name: new ProductName("Mouse Óptico Gamer X200"),
      description: "Mouse óptico con sensor de 8000 DPI, 6 botones programables e iluminación RGB.",
      price: new Price(24.99),
      stock: new Stock(50),
    }),
    new Product({
      id: new ProductId("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
      name: new ProductName("Teclado Mecánico Custom TKL"),
      description: "Teclado mecánico tenkeyless con switches intercambiables en caliente.",
      price: new Price(79.9),
      stock: new Stock(30),
    }),
    new Product({
      id: new ProductId("9b2e1d3a-6c4f-4e8b-9a1d-2f3b4c5d6e7f"),
      name: new ProductName("Auriculares Inalámbricos Bluetooth 5.0"),
      description: "Auriculares over-ear con cancelación de ruido activa y 30 horas de batería.",
      price: new Price(59.5),
      stock: new Stock(40),
    }),
    new Product({
      id: new ProductId("7c9e6679-7425-40de-944b-e07fc1f90ae7"),
      name: new ProductName("Mousepad XL Extendido"),
      description: "Mousepad de tela extendido 90x40cm, base antideslizante de goma.",
      price: new Price(14.99),
      stock: new Stock(100),
    }),
    new Product({
      id: new ProductId("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
      name: new ProductName("Monitor Gamer 24'' 144Hz"),
      description: "Monitor Full HD de 24 pulgadas, panel IPS, 144Hz y 1ms de respuesta.",
      price: new Price(189.0),
      stock: new Stock(15),
    }),
  ];
}

## Tecnologias a usar
- [x] NodeJS HTTP Server (sin framework).
- [x] Redis
- [x] React
- [x] socket.io
- [x] Babel (ES6)

## Request a la API
- [x] API: http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F

## Requerimientos:
- [x] La idea sera mostrar 5 stocks al mismo tiempo (AAPL, ABC, MSFT, TSLA, F) y actualizar a traves de websockets los resultados cada vez que cambian.

- [x] Si el mercado esta cerrado, informar la usuario que no se va a actualizar mas hasta la proxima apertura.

- [x] Cada stock debera tener una vista adicional, esta vista, presentara el historico de precios de dicho stock que tiene la app en una tabla con los valores, esta tabla tambien debera actualizarse e ir agregando los precios a medida que el servicio informe que se actualizaron.

- [x] La data debera ser guardada en Redis, usando Hashes para cada stock y el timestamp (unix) para cada transaccion guardada.

- [x] La API debera simular un 10% rate de errores usando el siguiente codigo:

`if (Math.rand(0, 1) < 0.1) throw new Error('How unfortunate! The API Request Failed')`

La idea es que si se presenta este error, se vuelva a intentar la llamada las veces que sea necesario. Se debera capturar SOLAMENTE este error para los reintentos, si existe otro error (ej: se cayo el api) debera manejarse de otra manera (informandole al usuario la ultima actualizacion, que no existe conexion con el api, etc).

- [x] La app debera estar en Heroku (existe un tier gratis de Redis para usar su servicio, de lo contrario Redislabs tambien cuenta con un tier gratis como servicio).

const fs = require("fs")
const sslCert = require("get-ssl-certificate")

const quincena = require("./src/helpers/quincena")
const data = require("./data/data.json")

const getCert = (listOfURLs, folder) => {
  try {
    listOfURLs.map(url => {
      sslCert
        .get(url)
        .then(cert => {
          if (cert) {
            const hoy = new Date()
            const vencimientoCrt = new Date(cert.valid_to)
            console.log(
              `Vencimiento ${url.replace(".com.py", "")}: `,
              vencimientoCrt
            )
            // Verifica si quedan 15 días o menos para el
            // vencimiento del certificado
            if (vencimientoCrt - hoy <= quincena) {
              fs.writeFileSync(`${folder}/${url}.pem`, cert.pemEncoded)
              console.log("Certificados actualizados")
            } else {
              console.log("Todavía falta!")
            }
          }
        })
        .catch(error => {
          if (error) {
            console.log("Cert not found: ", error.message)
          }
        })
    })
    return "Cert created succesfully"
  } catch (error) {
    return "There was an error"
  }
}

const urls = data.urls
getCert(urls, "./files")

module.exports = getCert
